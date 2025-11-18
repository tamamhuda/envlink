import { ref } from "vue";
import { ofetch } from "ofetch";
import { useAuthStore, useAuthCookie } from "#imports";
import { navigateTo, useRuntimeConfig } from "#app";
import type { FetchError, FetchOptions } from "ofetch";
import type { TokensResponse } from "~/interfaces/api.interface";

/**
 * Composable for making API requests with reactive state and token refresh handling.
 *
 * @template TResponse - Expected response data type
 * @template TError - Expected error data type
 * @template TPayload - Optional payload type for POST/PUT/PATCH requests
 */
export function useApi<TResponse = unknown, TError = any, TPayload = any>(
  path: string,
  options: FetchOptions<"json", TResponse> & {
    requireAuthorization?: boolean;
  } = {
    requireAuthorization: false,
  },
  fallbackIsRequireAuthorization: boolean = false,
) {
  const config = useRuntimeConfig();
  const cookie = useAuthCookie();
  const auth = useAuthStore();
  const { apiBase: baseURL, appUrl } = config.public;
  const isAuthRequired =
    options.requireAuthorization || fallbackIsRequireAuthorization;

  const data = ref<TResponse | null>(null);
  const error = ref<FetchError<TError> | null>(null);
  const loading = ref(false);

  /** Refresh expired access tokens using ofetch (non-reactive) */
  async function refreshTokens(): Promise<boolean> {
    try {
      const cookieStr = cookie.value;
      if (!cookieStr) throw new Error("No auth cookie found");

      const tokens = JSON.parse(cookieStr);
      if (!tokens.refresh_token) throw new Error("Missing refresh token");

      const res = await ofetch<TokensResponse>(
        `${baseURL}/api/v1/auth/refresh`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${tokens.refresh_token}` },
          cache: "no-cache",
        },
      );

      if (!res?.data) throw new Error("Invalid refresh response");

      auth.setTokens(res.data as any);
      cookie.value = JSON.stringify(res.data);
      return true;
    } catch (err) {
      console.error("Token refresh failed:", err);
      auth.clearAuth();
      navigateTo("/login");
      return false;
    }
  }

  /** Build headers dynamically */
  function buildHeaders(): Headers {
    const headers = new Headers(options.headers || {});
    headers.set("x-client-url", appUrl);

    if (isAuthRequired && cookie.value) {
      try {
        const tokens = JSON.parse(cookie.value);
        headers.set("Authorization", `Bearer ${tokens.access_token}`);
      } catch {
        cookie.value = null;
      }
    }

    return headers;
  }

  /** Execute request with refresh+retry handling */
  async function execute(extOptions?: {
    body?: TPayload;
    params?: Record<string, any>;
    query?: Record<string, any>;
  }): Promise<TResponse | undefined> {
    loading.value = true;
    error.value = null;

    // example if any params inside path eg: /users/:id/
    // replace :id with execute options params.id
    const normalizedPath = path.replace(/:([^/]+)/g, (_, param) => {
      const value = extOptions?.params?.[param];
      if (value === undefined) {
        throw new Error(`Missing parameter ${param}`);
      }
      return encodeURIComponent(value);
    });

    try {
      const response = await ofetch<TResponse>(normalizedPath, {
        baseURL,
        cache: "no-cache",
        headers: buildHeaders(),
        body: extOptions?.body as any,
        query: extOptions?.query,
        ...options,
      });

      data.value = response;
      return response;
    } catch (err: any) {
      error.value = err;
      // Handle 401: try refresh & retry
      if (err?.response?.status === 401 && isAuthRequired) {
        const refreshed = await refreshTokens();
        if (refreshed && cookie.value) {
          const tokens = JSON.parse(cookie.value);
          const retryHeaders = buildHeaders();
          retryHeaders.set("Authorization", `Bearer ${tokens.access_token}`);

          try {
            const retryData = await ofetch<TResponse>(normalizedPath, {
              baseURL,
              headers: retryHeaders,
              cache: "no-cache",
              body: extOptions?.body as any,
              query: extOptions?.query,
              ...options,
            });
            data.value = retryData;
            error.value = null;
            return retryData;
          } catch (retryErr: any) {
            error.value = retryErr;
          }
        }
      }
      return undefined;
    } finally {
      loading.value = false;
    }
  }

  return { data, error, loading, execute };
}
