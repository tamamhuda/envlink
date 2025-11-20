import { useAuthCookie, useUserApi } from "#imports";
import { defineStore } from "pinia";
import {
  TokensFromJSON,
  TokensToJSON,
  type SubscriptionInfo,
  type Tokens,
  type UserInfo,
} from "~/client";
import type { EnvlinkErrorContext } from "~/client/src/wrap/types";

type AuthState = {
  user: UserInfo | null;
  tokens: Tokens | null;
  errors: EnvlinkErrorContext | null;
  activeSubscriptions: SubscriptionInfo | null;
  initialized: boolean;
};

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    tokens: null,
    errors: null,
    activeSubscriptions: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.tokens && state.user),
  },

  actions: {
    setUser(user: UserInfo) {
      this.user = user;
    },

    setSubscription(subscription: SubscriptionInfo) {
      this.activeSubscriptions = subscription;
    },

    setTokens(tokens: Tokens) {
      this.tokens = tokens;
      if (import.meta.client) {
        const cookie = useAuthCookie();

        cookie.value = JSON.stringify(TokensToJSON(tokens));
      }
    },
    getTokens() {
      if (import.meta.client) {
        const cookie = useAuthCookie();

        return cookie.value
          ? TokensFromJSON(JSON.parse(cookie.value))
          : undefined;
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
        this.tokens = TokensFromJSON(JSON.parse(cookie.value));
      } catch {
        console.warn("Invalid auth cookie, clearing it.");
        this.tokens = null;
        useAuthCookie().value = null;
      }
    },

    async initializeAuth() {
      if (this.initialized || !import.meta.client) return;

      await this.bootstrapTokens();
      if (!this.tokens) return;
      const { getUserInfo } = useUserApi().getInfo();

      await getUserInfo();
      this.initialized = true;
    },
  },
});
