import { useApi, useAuthCookie } from "#imports";
import { navigateTo } from "nuxt/app";
import { defineStore } from "pinia";
import type { components } from "~/types/api";

type User = components["schemas"]["UserInfoResponse"]["data"];
type Tokens = components["schemas"]["AuthenticatedResponse"]["data"]["tokens"];
type AuthResponse = components["schemas"]["AuthenticatedResponse"];
type ErrorResponse = components["schemas"]["ErorrResponse"];

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    tokens: null as Tokens | null,
    initialized: false,
    error: null as string | null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.tokens && state.user),
  },

  actions: {
    setUser(user: User) {
      this.user = user;
    },

    setTokens(tokens: Tokens) {
      this.tokens = tokens;

      if (import.meta.client) {
        const cookie = useAuthCookie();
        cookie.value = JSON.stringify(tokens);
      }
    },

    clearAuth() {
      this.user = null;
      this.tokens = null;
      const cookie = useAuthCookie();
      cookie.value = null;
    },

    async useFetchLogin(credentials: components["schemas"]["LoginBodyDto"]) {
      const { execute, pending, error } = await useApi<
        AuthResponse,
        ErrorResponse
      >("/api/v1/auth/login", {
        method: "POST",
        body: credentials,
        immediate: false,
        onResponse: async ({ response }) => {
          if (response._data) {
            const { tokens, user } = response._data.data;
            this.setTokens(tokens);
            this.setUser(user);
            await navigateTo("/dashboard");
          }
        },
      });

      return { login: execute, pending, error };
    },

    async useFetchRegister(
      registrationForm: components["schemas"]["RegisterBodyDto"],
    ) {
      const { execute, pending, error } = await useApi<
        AuthResponse,
        ErrorResponse
      >("/api/v1/auth/register", {
        method: "POST",
        body: registrationForm,
        immediate: false,
        onResponse: async ({ response }) => {
          if (response._data) {
            const { tokens, user } = response._data.data;
            this.setTokens(tokens);
            this.setUser(user);
            await navigateTo({
              path: "/account/verification",
              query: { from: "register" },
            });
          }
        },
      });

      return { register: execute, pending, error };
    },

    async useFetchUser() {
      const { execute, data, pending, error } = await useApi<
        components["schemas"]["UserInfoResponse"],
        ErrorResponse
      >(
        "/api/v1/user/me",
        {
          method: "GET",
          immediate: false,
          onResponse: ({ response }) => {
            if (response._data?.data) {
              this.setUser(response._data.data);
            }
          },
        },
        true,
      );

      return { executeFetchUser: execute, data, pending, error };
    },

    async logout({ redirect = true } = {}) {
      this.clearAuth();
      if (redirect) await navigateTo("/login");
    },

    hasCookie() {
      const cookie = useAuthCookie();
      return !!cookie.value;
    },

    async bootstrapTokens() {
      const cookie = useAuthCookie();
      if (!cookie.value) {
        this.tokens = null;
        this.initialized = false;
        return;
      }

      try {
        this.tokens = JSON.parse(cookie.value);
      } catch {
        console.warn("Invalid auth cookie, clearing it.");
        this.tokens = null;
        useAuthCookie().value = null;
      }

      this.initialized = false;
    },

    async initializeAuth() {
      if (this.initialized || !import.meta.client) return;
      this.initialized = true;

      await this.bootstrapTokens();
      if (!this.tokens) return;

      const { executeFetchUser } = await this.useFetchUser();
      await executeFetchUser();
    },
  },
});
