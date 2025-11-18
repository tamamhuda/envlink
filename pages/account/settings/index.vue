<script setup lang="ts">
import { definePageMeta, ref } from "#imports";
import type { components } from "~/types/api.d";
import Content from "~/components/Content.vue";
import { Monitor, Smartphone } from "lucide-vue-next";

definePageMeta({
  layout: "account",
});

type Session = components["schemas"]["SessionsInfoResponse"]["data"][number];

// Dummy data for sessions
const sessions = ref<Session[]>([
  {
    id: "session_1",
    user_agent: "Chrome on macOS",
    ip_location: "New York, USA",
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    is_revoked: false,
    updated_at: new Date().toISOString(),
    revoked_at: null,
    user: {} as any,
  },
  {
    id: "session_2",
    user_agent: "Safari on iPhone",
    ip_location: "London, UK",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 21).toISOString(),
    is_revoked: false,
    updated_at: new Date().toISOString(),
    revoked_at: null,
    user: {} as any,
  },
]);

const revokeSession = (sessionId: string) => {
  sessions.value = sessions.value.filter((s) => s.id !== sessionId);
  console.log(`Session ${sessionId} revoked.`);
};

const revokeAllSessions = () => {
  sessions.value = [];
  console.log("All sessions revoked.");
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleString();
};

const getDeviceIcon = (userAgent: string) => {
  if (
    userAgent.toLowerCase().includes("iphone") ||
    userAgent.toLowerCase().includes("mobile")
  ) {
    return Smartphone;
  }
  return Monitor;
};
</script>

<template>
  <Content :is-ready="true">
    <div class="space-y-8">
      <!-- Security Section -->
      <div
        class="rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
      >
        <h3 class="text-lg font-semibold leading-6">Security</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account's security settings.
        </p>
        <div class="mt-6 divide-y divide-[var(--border-color)]">
          <div class="py-4 flex items-center justify-between">
            <div>
              <p class="font-medium">Change Password</p>
              <p class="text-sm text-gray-500">
                It's a good idea to use a strong password that you're not using
                elsewhere.
              </p>
            </div>
            <NuxtLink
              to="/account/settings/security/change-password"
              class="ml-4 px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex-shrink-0 inline-flex items-center gap-2 border-l border-t border-white shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Change
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Session Management Section -->
      <div
        class="rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold leading-6">Active Sessions</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This is a list of devices that have logged into your account.
            </p>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 bg-red-600 text-white shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none hover:translate-x-[2px] hover:translate-y-[2px] text-sm"
            @click="revokeAllSessions"
          >
            Revoke All
          </button>
        </div>
        <div class="mt-6 flow-root">
          <ul
            role="list"
            class="my-4 space-y-3 divide-y divide-[var(--border-color)]"
          >
            <li
              v-for="session in sessions"
              :key="session.id"
              class="group relative flex items-center justify-between px-5 py-4 border border-[var(--text-color)] rounded-md bg-transparent text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)] hover:bg-gray-200 dark:hover:bg-gray-800/50"
            >
              <div class="flex items-center min-w-0">
                <component
                  :is="getDeviceIcon(session.user_agent as string)"
                  class="h-6 w-6 text-gray-500 mr-4 flex-shrink-0"
                />
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate">
                    {{ session.user_agent }}
                  </p>
                  <p class="text-sm text-gray-500 truncate">
                    {{ session.ip_location }} • Last active:
                    {{ formatDate(session.created_at as string) }}
                  </p>
                </div>
              </div>
              <button
                @click="revokeSession(session.id)"
                class="ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Revoke
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Danger Zone -->
      <div
        class="rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
      >
        <h3
          class="text-lg font-semibold leading-6 text-red-600 dark:text-red-400"
        >
          Danger Zone
        </h3>
        <div class="mt-6 divide-y divide-red-500/30">
          <div class="py-4 flex items-center justify-between">
            <div>
              <p class="font-medium">Logout from all devices</p>
              <p class="text-sm text-gray-500">
                This will revoke all active sessions and log you out from every
                device.
              </p>
            </div>
            <button
              @click="revokeAllSessions"
              class="ml-4 px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 flex-shrink-0 inline-flex items-center gap-2 border-l border-t border-white shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Logout Everywhere
            </button>
          </div>
          <div class="py-4 flex items-center justify-between">
            <div>
              <p class="font-medium">Delete Account</p>
              <p class="text-sm text-gray-500">
                Permanently delete your account and all of your content.
              </p>
            </div>
            <button
              class="ml-4 px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-800 hover:bg-red-900 flex-shrink-0 inline-flex items-center gap-2 border-l border-t border-white shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </Content>
</template>
