import { ref } from "vue";
import { useAuthStore, useAuthCookie } from "#imports";
import { navigateTo, useFetch, useRuntimeConfig } from "#app";
import type { FetchError } from "ofetch";
import type { TokensResponse } from "~/interfaces/api.interface";

export async function useApi<T = unknown, E = FetchError<T>>(
  path: string,
  options: Parameters<typeof useFetch<T>>[1] = {},
  isAuthRequired = false,
): Promise<ReturnType<typeof useFetch<T, FetchError<E>>>> {
  const config = useRuntimeConfig();
  const cookie = useAuthCookie();
  const auth = useAuthStore();
  const { apiBase: baseURL, appUrl } = config.public;

  const error = ref<FetchError<E> | undefined>(undefined);

  /** Refresh expired access tokens using $fetch (non-reactive) */
  async function refreshTokens(): Promise<boolean> {
    try {
      const cookieStr = cookie.value;
      if (!cookieStr) throw new Error("No auth cookie found");

      const tokens = JSON.parse(cookieStr);
      if (!tokens.refresh_token) throw new Error("Missing refresh token");

      const res = await $fetch<TokensResponse>(
        `${baseURL}/api/v1/auth/refresh`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${tokens.refresh_token}` },
          cache: "no-cache",
        },
      );

      if (!res?.data) throw new Error("Invalid refresh response");

      auth.setTokens(res.data);
      cookie.value = JSON.stringify(res.data);
      return true;
    } catch (err) {
      console.error("Token refresh failed:", err);
      auth.logout();
      navigateTo("/login");
      return false;
    }
  }

  /** Main reactive fetch */
  const fetchResponse = await useFetch<T, FetchError<E>>(path, {
    baseURL,
    cache: "no-cache",

    onRequest({ options }) {
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

      options.headers = headers;
    },

    /** Handle 401 → refresh → retry with $fetch */
    async onResponseError({ response, options: errorOptions }) {
      // Capture first error
      error.value = { data: response._data } as FetchError<E>;
      console.log(response._data);
      if (response.status !== 401 || !isAuthRequired) return;

      const refreshed = await refreshTokens();
      const newCookie = cookie.value;
      if (!refreshed || !newCookie) return;

      const tokens = JSON.parse(newCookie);
      const retryHeaders = new Headers(errorOptions.headers || {});
      retryHeaders.set("Authorization", `Bearer ${tokens.access_token}`);

      try {
        const retryData = await $fetch<T>(path, {
          baseURL,
          headers: retryHeaders,
          cache: "no-cache",
          ...(options as any),
        });

        fetchResponse.data.value = retryData as any;
        error.value = undefined;
      } catch (retryErr) {
        error.value = retryErr as FetchError<E>;
      }
    },

    ...options,
  });

  return { ...fetchResponse, error };
}
