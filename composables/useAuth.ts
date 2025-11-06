import { useAuthCookie } from "#imports";
import { navigateTo, useNuxtApp } from "nuxt/app";
import { defineStore } from "pinia";
import type { components } from "~/types/api";

type User = components["schemas"]["UserInfoResponse"]["data"];
type Tokens = components["schemas"]["AuthenticatedResponse"]["data"]["tokens"];

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    tokens: null as Tokens | null,
    initialized: false, // prevent multiple re-fetch
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

    async register(registrationForm: components["schemas"]["RegisterBodyDto"]) {
      const api = useNuxtApp().$api;
      const response = await api<
        components["schemas"]["AuthenticatedResponse"]
      >("/api/v1/auth/register", { method: "POST", body: registrationForm });

      if (response?.data) {
        const { tokens, user } = response.data;
        this.setTokens(tokens);
        this.setUser(user);
        await navigateTo("/verify");
      }
    },

    async login(credentials: components["schemas"]["LoginBodyDto"]) {
      const api = useNuxtApp().$api;
      const response = await api<
        components["schemas"]["AuthenticatedResponse"]
      >("/api/v1/auth/login", { method: "POST", body: credentials });

      if (response?.data) {
        const { tokens, user } = response.data;
        this.setTokens(tokens);
        this.setUser(user);
        await navigateTo("/dashboard");
      }
    },

    async logout({ redirect = true } = {}) {
      this.user = null;
      this.tokens = null;
      if (import.meta.client) {
        const cookie = useAuthCookie();
        cookie.value = null;
      }
      if (redirect) await navigateTo("/login");
    },

    async fetchUser() {
      // if (!import.meta.client) return;
      if (!this.tokens) return;

      const api = useNuxtApp().$api;
      try {
        const response = await api<components["schemas"]["UserInfoResponse"]>(
          "/api/v1/user/me",
          {
            method: "GET",
          },
        );
        if (response?.data) {
          this.setUser(response.data);
        }
      } catch {
        await this.logout();
      }
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

      if (!this.tokens) return; // nothing to initialize

      try {
        await this.fetchUser(); // API request
      } catch (err) {
        console.warn("User fetch failed:", err);
        await this.logout({ redirect: false });
      }
    },
  },
});
