import { useAccountApi, useAuthCookie, useUserApi } from "#imports";
import { navigateTo } from "nuxt/app";
import { defineStore } from "pinia";
import type { Tokens, User } from "~/interfaces/api.interface";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    tokens: null as Tokens | null,
    initialized: false,
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

      await this.bootstrapTokens();
      if (!this.tokens) return;

      const userApi = useUserApi();
      const { fetchUser } = await userApi.useFetchUser();
      await fetchUser();
      this.initialized = true;
      console.log("User initialized");
    },

    async logout({ redirect = true } = {}) {
      if (!this.tokens) return;
      this.clearAuth();
      if (redirect) await navigateTo("/login");
    },
  },
});
