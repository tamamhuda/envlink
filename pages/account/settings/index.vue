<script setup lang="ts">
import {
  definePageMeta,
  onMounted,
  ref,
  useSessionsApi,
  useSessionsStore,
} from "#imports";
import Content from "~/components/Content.vue";
import { Monitor, Smartphone } from "lucide-vue-next";
import { computed } from "vue";

definePageMeta({
  layout: "account",
});

const sessionsStore = useSessionsStore();
const sessionsApi = useSessionsApi();

const sessions = computed(() => sessionsStore.activeSessions);
const currentSession = computed(() => sessions.value.find((s) => s.isCurrent));
const otherSessions = computed(() =>
  sessions.value.filter((s) => !s.isCurrent)
);

const isReady = ref<boolean>(false);
const errorMessage = ref<string | null>(null);
const revokingSessionId = ref<string | null>(null);

const {
  revokeSessionById,
  error: errorRevokeByid,
  pending: isLoadingRevokeById,
} = sessionsApi.revokeById();

const {
  revokeAllActiveSessions,
  error: errorRevokeAll,
  pending: isLoadingRevokeAll,
} = sessionsApi.revokeAllActive();

const revokeSession = async (sessionId: string) => {
  errorMessage.value = null;
  revokingSessionId.value = sessionId;
  await revokeSessionById(sessionId);
  if (errorRevokeByid.value) {
    errorMessage.value = errorRevokeByid.value.message || "An error occurred";
  }
  revokingSessionId.value = null;
};

const revokeAllSessions = async (keepCurrent: boolean = true) => {
  errorMessage.value = null;

  await revokeAllActiveSessions(keepCurrent);
  if (errorRevokeAll.value) {
    errorMessage.value = errorRevokeAll.value.message || "An error occurred";
  }
};

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleString();
};

const getDeviceIcon = (deviceType?: string) => {
  if (
    deviceType &&
    (deviceType.toLowerCase().includes("iphone") ||
      deviceType.toLowerCase().includes("mobile"))
  ) {
    return Smartphone;
  }
  return Monitor;
};

onMounted(async () => {
  await sessionsStore.initializeSessions();
  if (import.meta.client && sessionsStore.initialize) {
    isReady.value = true;
  }
});
</script>

<template>
  <Content :is-ready="isReady">
    <div class="space-y-8">
      <!-- Security Section -->
      <div class="box-inner-card p-4 sm:p-8">
        <h3 class="text-lg font-semibold leading-6">Security</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account's security settings.
        </p>
        <div class="mt-6 divide-y divide-(--border-color)">
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
              class="button-box hover:translate-0.5"
            >
              Change
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Session Management Section -->
      <div class="box-inner-card group p-4 sm:p-8">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold leading-6">Active Sessions</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This is a list of devices that have logged into your account.
            </p>
          </div>
          <button
            class="button-box danger transition-all"
            :class="{
              'opacity-50 cursor-not-allowed pointer-events-none':
                isLoadingRevokeAll || sessions.length <= 1,
              'hover:translate-0.5': !(
                isLoadingRevokeAll || sessions.length <= 1
              ),
            }"
            :disabled="isLoadingRevokeAll || sessions.length <= 1"
            @click="revokeAllSessions(true)"
          >
            <svg
              v-if="isLoadingRevokeAll"
              class="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ isLoadingRevokeAll ? "Revoking..." : "Revoke All" }}
          </button>
        </div>
        <div
          v-if="errorMessage"
          class="rounded-md bg-red-50 p-4 border border-red-200 mt-4"
        >
          <p class="text-sm font-medium text-center text-red-800">
            {{ errorMessage }}
          </p>
        </div>
        <div class="mt-6 flow-root">
          <ul role="list" class="my-4 space-y-3">
            <!-- Current Session -->
            <li v-if="currentSession" class="card-box p-4">
              <div class="flex items-center min-w-0">
                <component
                  :is="getDeviceIcon(currentSession.deviceType)"
                  class="h-6 w-6 text-blue-600 dark:text-blue-400 mr-4 shrink-0"
                />
                <div class="min-w-0 space-y-2">
                  <p class="text-sm font-medium truncate flex items-center">
                    <span>{{
                      `${currentSession.browser} ${currentSession.deviceType} ${currentSession.os}`
                    }}</span>
                    <span
                      class="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Current
                    </span>
                  </p>
                  <p class="text-sm text-gray-500 truncate">
                    {{ currentSession.ipLocation }} • Last active:
                    {{ formatDate(currentSession.createdAt) }}
                  </p>
                </div>
              </div>
            </li>

            <!-- Other Sessions -->
            <li
              v-for="session in otherSessions"
              :key="session.id"
              class="card-box p-4"
            >
              <div class="flex items-center min-w-0 group">
                <component
                  :is="getDeviceIcon(session.deviceType)"
                  class="h-6 w-6 text-gray-500 mr-4 shrink-0"
                />
                <div class="min-w-0 space-y-2">
                  <p class="text-sm font-medium truncate flex items-center">
                    <span>{{
                      `${session.browser} ${session.deviceType} ${session.os}`
                    }}</span>
                  </p>
                  <p class="text-sm text-gray-500 truncate">
                    {{ session.ipLocation }} • Last active:
                    {{ formatDate(session.createdAt) }}
                  </p>
                </div>
              </div>

              <button
                class="button-box-small danger group"
                :class="{
                  'opacity-100':
                    isLoadingRevokeById && revokingSessionId === session.id,
                  'opacity-0 group-hover:opacity-100':
                    !isLoadingRevokeById || revokingSessionId !== session.id,
                  'cursor-not-allowed': isLoadingRevokeById,
                }"
                :disabled="isLoadingRevokeById"
                @click="revokeSession(session.id)"
              >
                <svg
                  v-if="isLoadingRevokeById && revokingSessionId === session.id"
                  class="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{
                  isLoadingRevokeById && revokingSessionId === session.id
                    ? "Revoking..."
                    : "Revoke"
                }}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="box-inner-card p-4 sm:p-8">
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
              :disabled="isLoadingRevokeAll"
              class="button-box danger hover:translate-0.5"
              :class="{
                'opacity-50 cursor-not-allowed': isLoadingRevokeAll,
                '': !isLoadingRevokeAll,
              }"
              @click="revokeAllSessions(false)"
            >
              <svg
                v-if="isLoadingRevokeAll"
                class="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {{ isLoadingRevokeAll ? "Logging out..." : "Logout Everywhere" }}
            </button>
          </div>
          <div class="py-4 flex items-center justify-between">
            <div>
              <p class="font-medium">Delete Account</p>
              <p class="text-sm text-gray-500">
                Permanently delete your account and all of your content.
              </p>
            </div>
            <button class="button-box danger">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  </Content>
</template>
