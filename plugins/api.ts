import { defineNuxtPlugin, useRuntimeConfig, navigateTo } from "#app";
import { useAuthCookie, useAuthStore } from "#imports";
import { ofetch, type FetchOptions } from "ofetch";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const apiFetch = ofetch.create({
    baseURL: config.public.apiBase,

    async onRequest({ options }) {
      // Use client-only auth cookie access

      const cookie = useAuthCookie();
      if (!cookie.value) return;

      try {
        const tokens = JSON.parse(cookie.value);
        const headers = options.headers;

        // Merge new headers safely
        headers.append("Authorization", `Bearer ${tokens.access_token}`);

        // Debug only during delopment
        if (import.meta.client) {
          console.debug("[apiFetch] headers:", options.headers);
        }
      } catch (err) {
        console.warn("[apiFetch] Invalid auth cookie", err);
      }
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        console.warn("[apiFetch] Unauthorized — redirecting to login");
        const auth = useAuthStore();
        await auth.logout({ redirect: false });
        navigateTo("/login");
      }
    },
  });

  // Typed helper wrapper
  const api = async <T = unknown>(
    url: string,
    options?: FetchOptions<"json", any> | undefined,
  ): Promise<T> => {
    return apiFetch<T>(url, options);
  };

  // Inject into Nuxt app context
  nuxtApp.provide("api", api);
});
