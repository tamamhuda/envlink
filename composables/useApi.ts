import { useAuthStore, useAuthCookie } from "#imports";
import { useFetch, useRuntimeConfig } from "#app";
import type { FetchError } from "ofetch";

export async function useApi<T = unknown, E = FetchError<T>>(
  path: string,
  options: Parameters<typeof useFetch<T>>[1] = {},
  isAuthRequired = false,
): Promise<ReturnType<typeof useFetch<T, FetchError<E>>>> {
  const config = useRuntimeConfig();
  const cookie = useAuthCookie();
  const auth = useAuthStore();
  const baseUrl = config.public.apiBase;

  return await useFetch<T, FetchError<E>>(path, {
    baseURL: baseUrl,

    onRequest({ options }) {
      if (isAuthRequired && import.meta.client && cookie.value) {
        try {
          const tokens = JSON.parse(cookie.value);
          options.headers = new Headers(options.headers || {});
          options.headers.set("Authorization", `Bearer ${tokens.access_token}`);
        } catch {
          cookie.value = null;
        }
      }
    },

    async onResponse({ response }) {
      console.log("Response:", response._data);
    },

    onRequestError({ response }) {
      console.error("Request error:", response?._data);
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        await auth.logout({ redirect: false });
      }
      console.error("Response error:", response._data || response.statusText);
    },

    ...options,
  });
}
