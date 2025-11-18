import { ref, type Ref } from "vue";
import type { AuthConfig, WrappedApi } from "./types";
import {
  ResponseError,
  type AuthenticatedResponse,
  type TokensResponse,
} from "../generated";
import * as AuthenticationApi from "../generated/apis/AuthenticationApi";

/* ------------------------------------------------------------- */
/*                      Utility Helpers                           */
/* ------------------------------------------------------------- */
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

/* ------------------------------------------------------------- */
/*                       reactiveApi Function                     */
/* ------------------------------------------------------------- */
export function reactiveApi<T extends object>(
  handler: T,
  authConfig?: AuthConfig,
): WrappedApi<T> {
  const wrapped: Record<string, unknown> = {};
  const keys = collectAllKeys(handler);

  for (const rawKey of keys) {
    if (rawKey === "constructor") continue;
    const _key = rawKey as keyof T;

    let value: unknown;
    if (Object.prototype.hasOwnProperty.call(handler, rawKey)) {
      value = (handler as Record<string, unknown>)[rawKey];
    } else {
      value = (Object.getPrototypeOf(handler) as Record<string, unknown>)[
        rawKey
      ];
    }

    if (typeof value !== "function") {
      wrapped[rawKey] = value;
      continue;
    }

    const fn = value as (...args: unknown[]) => unknown;

    const isWrapReturning =
      rawKey === "withMiddleware" ||
      rawKey === "withPreMiddleware" ||
      rawKey === "withPostMiddleware" ||
      rawKey === "clone";
    const isRawHelper = rawKey === "request" || rawKey.endsWith("Raw");

    if (isWrapReturning) {
      wrapped[rawKey] = (...args: unknown[]) => {
        const next = fn.apply(handler, args) as T;
        return reactiveApi(next, authConfig);
      };
      continue;
    }

    if (isRawHelper) {
      wrapped[rawKey] = fn.bind(handler);
      continue;
    }

    /* ------------------------- Main endpoint wrapper ------------------------- */
    wrapped[rawKey] = () => {
      type Method = Extract<T[typeof _key], (...a: any[]) => any>;
      type MethodReturn = Awaited<ReturnType<Method>>;

      const pending: Ref<boolean> = ref(false);
      const error: Ref<unknown | null> = ref(null);
      const response: Ref<MethodReturn | null> = ref(null);
      const isRetrying: Ref<boolean> = ref(false);

      const execute = async (
        ...args: Parameters<Method>
      ): Promise<MethodReturn | null> => {
        pending.value = true;
        error.value = null;
        response.value = null;

        const doCall = async (
          retrying = false,
        ): Promise<MethodReturn | null> => {
          try {
            let modifiedArgs = args;

            if (retrying && authConfig?.getTokens) {
              const tokens = await authConfig.getTokens();
              const resolvedTokens =
                tokens instanceof Promise ? await tokens : tokens;

              if (resolvedTokens?.accessToken) {
                const firstArg = args[0] as Record<string, any> | undefined;
                if (firstArg && typeof firstArg === "object") {
                  modifiedArgs = [
                    {
                      ...firstArg,
                      headers: {
                        ...(firstArg.headers || {}),
                        Authorization: `Bearer ${resolvedTokens.accessToken}`,
                      },
                    },
                    ...args.slice(1),
                  ] as Parameters<Method>;
                }
              }
            }

            const result = await fn.apply(handler, modifiedArgs);

            // Login interception
            if (
              authConfig &&
              handler instanceof AuthenticationApi.AuthenticationApi &&
              rawKey === "login"
            ) {
              const tokensResponse = result as AuthenticatedResponse;
              await authConfig.setTokens(tokensResponse.data.tokens);
            }

            response.value = result as MethodReturn;
            return response.value;
          } catch (err: any) {
            const isTokenExpired =
              err?.response?.status === 401 || err?.message === "Token expired";

            if (
              !retrying &&
              isTokenExpired &&
              authConfig?.getTokens &&
              authConfig?.setTokens
            ) {
              isRetrying.value = true;
              try {
                const tokens = await authConfig.getTokens();
                const resolvedTokens =
                  tokens instanceof Promise ? await tokens : tokens;

                if (!resolvedTokens?.refreshToken) {
                  authConfig.onRefreshFailed?.();
                  return null;
                }

                const authApi = new AuthenticationApi.AuthenticationApi(
                  (handler as any).configuration,
                );

                const headers = new Headers();
                headers.append(
                  "Authorization",
                  `Bearer ${resolvedTokens.refreshToken}`,
                );

                const refreshRes = await authApi.refresh({ headers });
                await authConfig.setTokens(refreshRes.data);

                // Retry original request
                return doCall(true);
              } catch {
                authConfig.onRefreshFailed?.();
                return null;
              } finally {
                isRetrying.value = false;
              }
            }

            if (err instanceof ResponseError) {
              const errResponse = await err.response.json();
              error.value = errResponse;
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
