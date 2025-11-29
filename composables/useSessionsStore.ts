import { useSessionsApi } from "#imports";
import { defineStore } from "pinia";
import type { SessionInfo } from "~/client";

type SessionStoreState = {
  sessions: SessionInfo[];
  initialize: boolean;
};

export const useSessionsStore = defineStore("sessions", {
  state: (): SessionStoreState => ({
    initialize: false,
    sessions: [],
  }),

  getters: {
    activeSessions: (state) => state.sessions.filter((s) => !s.isRevoked),
    revokedSessions: (state) => state.sessions.filter((s) => s.isRevoked),
  },

  actions: {
    async initializeSessions() {
      if (this.initialize) return;

      const { getAllActiveSessions, response } =
        useSessionsApi().getAllActive();

      await getAllActiveSessions();
      if (response.value) {
        this.sessions = response.value.data;
      }
      this.initialize = true;
    },

    revokeById(id: string) {
      this.sessions = this.sessions.filter((s) => s.id !== id);
    },

    clearSession() {
      this.sessions = [];
      this.initialize = false;
    },

    revokeAll(keepCurrent: boolean = true) {
      if (!keepCurrent) {
        this.clearSession();
        return;
      }
      this.sessions = this.sessions.map((s) =>
        !s.isCurrent ? { ...s, isRevoked: true } : s,
      );
    },
  },
});
