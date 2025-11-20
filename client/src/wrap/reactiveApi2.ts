import { ref } from "vue";
import type { AuthConfig, WrappedApi, EnvlinkErrorContext } from "./types";

import * as AuthenticationApi from "../generated/apis/AuthenticationApi";
import { ResponseError, type ErrorResponse } from "../generated";

/* ========================================================================
   JWT Utility
   ======================================================================== */

function decodeJwtExpiry(token?: string): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = parts[1] ? JSON.parse(atob(parts[1])) : null;
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/* ========================================================================
   Global Error Guard (fires once per cooldown)
   ======================================================================== */

let hasThrown = false;
let cooldownUntil: number | null = null;
const COOLDOWN_MS = 3000;

export async function triggerGlobalErrorOnce(
  ctx: EnvlinkErrorContext,
  handler?: (ctx: EnvlinkErrorContext) => void | Promise<void>,
) {
  if (!handler) return;

  const now = Date.now();

  if (cooldownUntil && now < cooldownUntil) return;

  if (cooldownUntil && now >= cooldownUntil) {
    hasThrown = false;
    cooldownUntil = null;
  }

  if (!hasThrown) {
    hasThrown = true;
    cooldownUntil = now + COOLDOWN_MS;
    return await handler(ctx);
  }
}

export function resetGlobalErrorFlag() {
  hasThrown = false;
  cooldownUntil = null;
}

/* ========================================================================
   ErrorResponse Normalizer
   ======================================================================== */

async function normalizeError(
  err: any,
  endpoint: string,
  method: string,
): Promise<ErrorResponse> {
  if (err instanceof ResponseError && err.response) {
    try {
      const body = await err.response.json();

      return {
        success: body.success ?? false,
        status: body.status ?? err.response.status ?? 500,
        message: body.message ?? "Request failed",
        error: body.error ?? null,
        path: body.path ?? endpoint,
        timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
      };
    } catch {
      return {
        success: false,
        status: err.response.status ?? 500,
        message: "Failed to parse error body",
        error: err.message,
        path: endpoint,
        timestamp: new Date(),
      };
    }
  }

  if (err?.name === "TypeError" && err?.message === "Failed to fetch") {
    return {
      success: false,
      status: 0,
      message: "Network error",
      error: "NETWORK_ERROR",
      path: endpoint,
      timestamp: new Date(),
    };
  }

  return {
    success: false,
    status: err?.response?.status ?? 500,
    message: err?.message ?? "Unknown error",
    error: err?.error ?? null,
    path: endpoint,
    timestamp: new Date(),
  };
}

/* ========================================================================
   Background Token Refresh — safeCallRefresh
   ======================================================================== */

async function safeCallRefresh(
  api: AuthenticationApi.AuthenticationApi,
  headers: Headers,
  onError?: (ctx: EnvlinkErrorContext) => void | Promise<void>,
) {
  try {
    return await api.refresh({ headers });
  } catch (err: any) {
    const ctx: EnvlinkErrorContext = {
      type: "REFRESH_FAILED",
      error: err,
      endpoint: "/auth/refresh",
      method: "POST",
      status: err?.response?.status,
    };

    await triggerGlobalErrorOnce(ctx, onError);
    return null;
  }
}

/* ========================================================================
   GLOBAL REFRESH LOCK (refresh only once per burst)
   ======================================================================== */

let globalRefreshPromise: Promise<any> | null = null;

async function globalRefresh(
  authConfig: AuthConfig,
  onError?: (ctx: EnvlinkErrorContext) => void | Promise<void>,
) {
  if (globalRefreshPromise) return await globalRefreshPromise;

  globalRefreshPromise = (async () => {
    try {
      const tokens = await authConfig.getTokens();
      if (!tokens?.refreshToken) {
        await triggerGlobalErrorOnce(
          {
            type: "REFRESH_FAILED",
            error: "Missing refresh token",
            endpoint: "/auth/refresh",
            method: "POST",
            status: 401,
          },
          onError,
        );
        return null;
      }

      const api = new AuthenticationApi.AuthenticationApi();
      const headers = new Headers({
        Authorization: `Bearer ${tokens.refreshToken}`,
      });

      const refreshed = await safeCallRefresh(api, headers, onError);
      if (!refreshed) return null;

      await authConfig.setTokens(refreshed.data);
      scheduleTokenRefresh(authConfig, onError);

      return refreshed;
    } finally {
      // allow refresh again after 3 seconds
      setTimeout(() => {
        globalRefreshPromise = null;
      }, 3000);
    }
  })();

  return await globalRefreshPromise;
}

/* ========================================================================
   Scheduler
   ======================================================================== */

let refreshTimer: number | null = null;
const IMMEDIATE_THRESHOLD = 5000;

const APP_START_TIME = Date.now();
const STARTUP_GRACE_MS = 10_000;

export function scheduleTokenRefresh(
  authConfig: AuthConfig,
  onError?: (ctx: EnvlinkErrorContext) => void | Promise<void>,
) {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  (async () => {
    const tokens = await authConfig.getTokens();
    if (!tokens?.accessToken || !tokens?.refreshToken) return;

    const exp = decodeJwtExpiry(tokens.accessToken);
    if (!exp) return;

    const now = Math.floor(Date.now() / 1000);
    const fireAt = exp - 60;
    const delayMs = (fireAt - now) * 1000;

    if (delayMs <= IMMEDIATE_THRESHOLD) {
      const sinceStart = Date.now() - APP_START_TIME;

      if (sinceStart < STARTUP_GRACE_MS) return;

      await globalRefresh(authConfig, onError);
      return;
    }

    refreshTimer = setTimeout(() => {
      globalRefresh(authConfig, onError);
    }, delayMs) as any;
  })();
}

/* ========================================================================
   Scheduler Init
   ======================================================================== */

let schedulerInit = false;

export async function initAuthScheduler(
  authConfig: AuthConfig,
  onError?: (ctx: EnvlinkErrorContext) => void | Promise<void>,
) {
  if (schedulerInit) return;

  const tokens = await authConfig.getTokens();
  if (tokens?.accessToken && tokens?.refreshToken) {
    scheduleTokenRefresh(authConfig, onError);
    schedulerInit = true;
  }
}

/* ========================================================================
   Utilities
   ======================================================================== */

function collectAllKeys(obj: object): string[] {
  const keys = new Set<string>();
  let current: any = obj;

  while (current && current !== Object.prototype) {
    Object.getOwnPropertyNames(current).forEach((k) => keys.add(k));
    current = Object.getPrototypeOf(current);
  }

  return [...keys];
}

/* ========================================================================
   reactiveApi Wrapper
   ======================================================================== */

export function reactiveApi<T extends object>(
  handler: T,
  authConfig?: AuthConfig,
  onError?: (ctx: EnvlinkErrorContext) => void | Promise<void>,
): WrappedApi<T> {
  const wrapped: Record<string, unknown> = {};
  const keys = collectAllKeys(handler);

  keys.forEach((rawKey) => {
    if (rawKey === "constructor") return;

    const original = Object.prototype.hasOwnProperty.call(handler, rawKey)
      ? (handler as any)[rawKey]
      : (Object.getPrototypeOf(handler) as any)[rawKey];

    if (typeof original !== "function") {
      wrapped[rawKey] = original;
      return;
    }

    const fn = original as Function;

    const chainable =
      rawKey === "withMiddleware" ||
      rawKey === "withPreMiddleware" ||
      rawKey === "withPostMiddleware" ||
      rawKey === "clone";

    if (chainable) {
      wrapped[rawKey] = (...args: any[]) => {
        const next = fn.apply(handler, args) as T;
        return reactiveApi(next, authConfig, onError);
      };
      return;
    }

    const isRawHelper = rawKey === "request" || rawKey.endsWith("Raw");
    if (isRawHelper) {
      wrapped[rawKey] = fn.bind(handler);
      return;
    }

    wrapped[rawKey] = () => {
      const pending = ref(false);
      const error = ref<ErrorResponse | null>(null);
      const response = ref<any>(null);

      const execute = async (...args: any[]) => {
        pending.value = true;
        error.value = null;
        response.value = null;

        const callApi = async (retry = false): Promise<any> => {
          try {
            let modifiedArgs = args;

            if (retry && authConfig) {
              const tokens = await authConfig.getTokens();
              if (tokens?.accessToken) {
                const first = args[0];
                if (first && typeof first === "object") {
                  modifiedArgs = [
                    {
                      ...first,
                      headers: {
                        ...(first.headers || {}),
                        Authorization: `Bearer ${tokens.accessToken}`,
                      },
                    },
                    ...args.slice(1),
                  ];
                }
              }
            }

            const result = await fn.apply(handler, modifiedArgs);

            if (
              authConfig &&
              handler instanceof AuthenticationApi.AuthenticationApi &&
              rawKey === "login"
            ) {
              await authConfig.setTokens(result.data.tokens);
              scheduleTokenRefresh(authConfig, onError);
            }

            response.value = result;
            return result;
          } catch (err: any) {
            const endpoint = rawKey;
            const method = args[0]?.method || "GET";

            const parsed = await normalizeError(err, endpoint, method);
            error.value = parsed;

            const expired =
              parsed.status === 401 && parsed.message === "Token expired";

            if (expired && authConfig) {
              const refreshed = await globalRefresh(authConfig, onError);
              if (!refreshed) return null;

              return await callApi(true);
            }

            const ctx: EnvlinkErrorContext = {
              type:
                parsed.status === 0
                  ? "NETWORK_ERROR"
                  : parsed.status === 401
                    ? "UNAUTHORIZED"
                    : "API_ERROR",
              error: parsed,
              status: parsed.status,
              endpoint,
              method,
            };

            await triggerGlobalErrorOnce(ctx, onError);
            return null;
          }
        };

        try {
          return await callApi();
        } finally {
          pending.value = false;
        }
      };

      return { execute, pending, error, response };
    };
  });

  return wrapped as WrappedApi<T>;
}
