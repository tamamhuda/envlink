import { ref, type Ref } from "vue";
import type { AuthConfig, WrappedApi } from "./types";
import { ResponseError, type AuthenticatedResponse } from "../generated";
import * as AuthenticationApi from "../generated/apis/AuthenticationApi";

/* ========================================================================== */
/*                               Utility Helpers                               */
/* ========================================================================== */

/**
 * Collects all property keys (own + prototype) of an object.
 * Includes inherited method names so API clients can wrap both
 * instance and prototype-defined endpoints.
 */
function collectAllKeys(obj: object): string[] {
  const keys = new Set<string>();
  let current: object | null = obj;

  while (current && current !== Object.prototype) {
    for (const k of Object.getOwnPropertyNames(current)) {
      keys.add(k);
    }
    current = Object.getPrototypeOf(current);
  }

  return Array.from(keys);
}

/* ========================================================================== */
/*                           reactiveApi Main Wrapper                          */
/* ========================================================================== */

/**
 * Wraps an OpenAPI-generated API client to provide:
 * - Vue refs for pending/error/response states
 * - Auto-refresh token retry logic
 * - Login handling (persist tokens on login())
 * - Nested reactiveApi regeneration for `withMiddleware`, etc.
 *
 * @param handler - OpenAPI generated client instance
 * @param authConfig - Optional authentication token provider and callbacks
 */
export function reactiveApi<T extends object>(
  handler: T,
  authConfig?: AuthConfig,
): WrappedApi<T> {
  const wrapped: Record<string, unknown> = {};
  const keys = collectAllKeys(handler);

  for (const rawKey of keys) {
    if (rawKey === "constructor") continue;

    const _key = rawKey as keyof T;

    // Resolve method/value (own value or prototype)
    const value = Object.prototype.hasOwnProperty.call(handler, rawKey)
      ? (handler as any)[rawKey]
      : (Object.getPrototypeOf(handler) as any)[rawKey];

    /* ---------------------------------------------------------------------- */
    /*                         Non-function properties                         */
    /* ---------------------------------------------------------------------- */
    if (typeof value !== "function") {
      wrapped[rawKey] = value;
      continue;
    }

    const fn = value as (...args: unknown[]) => unknown;

    /* ---------------------------------------------------------------------- */
    /*                          Self-returning wrappers                        */
    /* ---------------------------------------------------------------------- */
    const isSelfReturning =
      rawKey === "withMiddleware" ||
      rawKey === "withPreMiddleware" ||
      rawKey === "withPostMiddleware" ||
      rawKey === "clone";

    if (isSelfReturning) {
      wrapped[rawKey] = (...args: unknown[]) => {
        const next = fn.apply(handler, args) as T;
        return reactiveApi(next, authConfig);
      };
      continue;
    }

    /* ---------------------------------------------------------------------- */
    /*                     Raw request helpers (skip wrapping)                 */
    /* ---------------------------------------------------------------------- */
    const isRawHelper = rawKey === "request" || rawKey.endsWith("Raw");

    if (isRawHelper) {
      wrapped[rawKey] = fn.bind(handler);
      continue;
    }

    /* ====================================================================== */
    /*                         Main endpoint wrapper                           */
    /* ====================================================================== */

    wrapped[rawKey] = () => {
      type Method = Extract<T[typeof _key], (...a: any[]) => any>;
      type MethodReturn = Awaited<ReturnType<Method>>;

      const pending: Ref<boolean> = ref(false);
      const error: Ref<unknown | null> = ref(null);
      const response: Ref<MethodReturn | null> = ref(null);
      const isRetrying: Ref<boolean> = ref(false);

      /**
       * Execute the wrapped endpoint with automatic handling of:
       * - Pending state
       * - Error parsing
       * - Token auto-refresh
       * - Login token storage
       */
      const execute = async (
        ...args: Parameters<Method>
      ): Promise<MethodReturn | null> => {
        pending.value = true;
        error.value = null;
        response.value = null;

        /**
         * Performs the actual request with optional retry.
         */
        const doCall = async (
          retrying = false,
        ): Promise<MethodReturn | null> => {
          try {
            let modifiedArgs = args;

            /* -------------------------------------------------------------- */
            /*                       Inject access token                      */
            /* -------------------------------------------------------------- */
            if (retrying && authConfig?.getTokens) {
              const tokens = await authConfig.getTokens();
              const resolved =
                tokens instanceof Promise ? await tokens : tokens;

              if (resolved?.accessToken) {
                const firstArg = args[0] as Record<string, any> | undefined;

                if (firstArg && typeof firstArg === "object") {
                  modifiedArgs = [
                    {
                      ...firstArg,
                      headers: {
                        ...(firstArg.headers || {}),
                        Authorization: `Bearer ${resolved.accessToken}`,
                      },
                    },
                    ...args.slice(1),
                  ] as Parameters<Method>;
                }
              }
            }

            /* -------------------------------------------------------------- */
            /*                          Perform Call                          */
            /* -------------------------------------------------------------- */
            const result = await fn.apply(handler, modifiedArgs);

            /* -------------------------------------------------------------- */
            /*                      Login token persistence                   */
            /* -------------------------------------------------------------- */
            if (
              authConfig &&
              handler instanceof AuthenticationApi.AuthenticationApi &&
              rawKey === "login"
            ) {
              await authConfig.setTokens(
                (result as AuthenticatedResponse).data.tokens,
              );
            }

            response.value = result as MethodReturn;
            return result as MethodReturn;
          } catch (err: any) {
            const tokenExpired =
              err?.response?.status === 401 || err?.message === "Token expired";

            /* -------------------------------------------------------------- */
            /*                Automatic refresh token retry                   */
            /* -------------------------------------------------------------- */
            if (
              !retrying &&
              tokenExpired &&
              authConfig?.getTokens &&
              authConfig?.setTokens
            ) {
              isRetrying.value = true;

              try {
                const tokens = await authConfig.getTokens();
                const resolved =
                  tokens instanceof Promise ? await tokens : tokens;

                if (!resolved?.refreshToken) {
                  authConfig.onRefreshFailed?.();
                  return null;
                }

                const authApi = new AuthenticationApi.AuthenticationApi(
                  (handler as any).configuration,
                );

                const headers = new Headers();
                headers.set("Authorization", `Bearer ${resolved.refreshToken}`);

                const refreshRes = await authApi.refresh({ headers });
                await authConfig.setTokens(refreshRes.data);

                // Retry original call
                return doCall(true);
              } catch {
                authConfig.onRefreshFailed?.();
                return null;
              } finally {
                isRetrying.value = false;
              }
            }

            /* -------------------------------------------------------------- */
            /*                      Error normalization                        */
            /* -------------------------------------------------------------- */
            if (err instanceof ResponseError) {
              error.value = await err.response.json();
            } else {
              error.value = err;
            }

            return null;
          }
        };

        try {
          return await doCall();
        } finally {
          pending.value = false;
        }
      };

      return { execute, pending, error, response, isRetrying };
    };
  }

  return wrapped as WrappedApi<T>;
}
