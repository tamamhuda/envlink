<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { navigateTo, useRoute } from "#app";
import {
  useAccountApi,
  useAuthStore,
  definePageMeta,
  useAuthApi,
} from "#imports";

// Layouts
import AuthenticatedLayout from "~/layouts/authenticated.vue";
import EmptyLayout from "~/layouts/empty.vue";
import { instanceOfErrorResponse } from "~/client/src/generated";
import Loader from "~/components/Loader.vue";

definePageMeta({ layout: "empty" });

// Core stores
const auth = useAuthStore();
const route = useRoute();
const authApi = useAuthApi();
const accountApi = useAccountApi();

// State
const user = ref(auth.user);
const isClient = ref(false);
const isClientReady = ref(false);
const lastResend = ref<Date | null>(null);
const message = ref<{ text: string; type: "success" | "error" | null }>({
  text: "",
  type: null,
});

// Derived state
const token = computed(() => String(route.query.token || "") || undefined);
const fromRegister = computed(
  () => route.query.from === "register" && user.value?.lastLoginAt == null
);
const isRequestVerify = computed(() => !!token.value);
const isAuthenticated = computed(() => auth.isAuthenticated);
const isVerified = computed(() => user.value?.providers.isVerified || false);

// API handlers
const {
  verify,
  response: verifyResponse,
  error: errorVerify,
  pending: pendingVerify,
} = authApi.verify();

const {
  resendVerification,
  error: errorResend,
  pending: pendingResend,
} = await accountApi.verifyResend();

const isResending = computed(() => pendingResend.value);
const isResendDisabled = computed(() => {
  if (!lastResend.value) return false;
  return Date.now() - lastResend.value.getTime() < 120_000;
});

const pageTitle = computed(() =>
  fromRegister.value
    ? "Registration Successful"
    : "Account Verification Required"
);
const pageDescription = computed(() =>
  fromRegister.value
    ? "You have successfully registered. Please verify your email to activate your account."
    : "Please verify your email to access all features."
);

// Actions
async function handleResend() {
  if (isResendDisabled.value || isResending.value) return;
  message.value = { text: "", type: null };
  await resendVerification();

  if (errorResend.value && instanceOfErrorResponse(errorResend.value)) {
    message.value = {
      text: errorResend.value.message || "Failed to resend verification email.",
      type: "error",
    };
    return;
  }

  lastResend.value = new Date();
  message.value = {
    text: "Verification email has been resent successfully.",
    type: "success",
  };
}

async function handleLoginRedirect() {
  await navigateTo("/login");
}

onMounted(async () => {
  isClient.value = true;

  if (isVerified.value) {
    await navigateTo("/dashboard");
    return;
  }

  // Handle token verification
  if (isRequestVerify.value && token.value) {
    await verify(token.value);

    if (verifyResponse.value) {
      message.value = {
        text: "Your account has been successfully verified.",
        type: "success",
      };
    }

    if (errorVerify.value) {
      const status = errorVerify.value.status;

      if (status === 403) {
        message.value = {
          text: isAuthenticated.value
            ? "Verification failed or token expired. Please resend the verification email."
            : "Verification failed or token expired. Please login to resend the verification email.",
          type: "error",
        };
      } else if (status === 409) {
        message.value = {
          text: "Your account is already verified.",
          type: "success",
        };
      } else {
        message.value = {
          text: "Verification failed. Please try again later.",
          type: "error",
        };
      }
    }

    isClientReady.value = true;
    return;
  }

  // Redirect unauthenticated users if no verification token
  if (!isAuthenticated.value && !isRequestVerify.value) {
    await navigateTo("/login");
    return;
  }

  isClientReady.value = true;
});
</script>

<template>
  <component
    :is="isClient && isAuthenticated ? AuthenticatedLayout : EmptyLayout"
  >
    <main
      class="text-center h-full items-center justify-center w-screen flex flex-1 my-14"
    >
      <div
        class="flex flex-1 w-full min-h-full flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-(--bg-color) text-(--text-color)"
      >
        <!-- Loading -->
        <div v-if="!isClientReady || pendingVerify"><Loader /></div>

        <!-- Case 1: Verification via token -->
        <div
          v-else-if="isRequestVerify"
          class="sm:mx-auto sm:w-full sm:max-w-md"
        >
          <div
            class="mt-8 py-8 px-4 shadow-[4px_4px_0_var(--text-color)] sm:rounded-lg sm:px-10 border border-[--text-color] bg-[--bg-color] text-center"
          >
            <h2 class="text-2xl font-bold mb-4">Account Verification</h2>

            <div v-if="message.text">
              <p
                class="text-sm font-medium p-3 rounded-md border"
                :class="{
                  'text-green-700 bg-green-50 border-green-200':
                    message.type === 'success',
                  'text-red-700 bg-red-50 border-red-200':
                    message.type === 'error',
                }"
              >
                {{ message.text }}
              </p>
            </div>

            <!-- Verified / Already Verified -->
            <div
              v-if="
                message.type === 'success' && message.text.includes('verified')
              "
              class="mt-4 space-x-2"
            >
              <button
                v-if="isAuthenticated"
                class="inline-flex justify-center items-center rounded-md border border-(--border-color) px-4 py-2 font-medium shadow-[4px_4px_0_var(--shadow-color)] transition-all bg-(--primary-color) text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--primary-color) hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--shadow-color)]"
                @click="navigateTo('/dashboard')"
              >
                Go to Dashboard
              </button>
              <button
                v-else
                class="rounded-md border border-[--text-color] px-4 py-2 font-medium shadow-[4px_4px_0_var(--text-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)] transition-all"
                @click="handleLoginRedirect"
              >
                Go to Login
              </button>
            </div>

            <!-- Error + authenticated -->
            <div v-else-if="message.type === 'error' && isAuthenticated">
              <button
                :disabled="isResendDisabled || isResending"
                class="button-box"
                :class="{
                  'opacity-50 cursor-not-allowed':
                    isResendDisabled || isResending,
                }"
                @click="handleResend"
              >
                <svg
                  v-if="isResending"
                  class="animate-spin -ml-1 mr-3 h-5 w-5 inline"
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
                {{ isResending ? "Resending..." : "Resend Verification Email" }}
              </button>
            </div>

            <!-- Error + unauthenticated -->
            <div v-else-if="message.type === 'error' && !isAuthenticated">
              <button class="button-box" @click="handleLoginRedirect">
                Go to Login
              </button>
            </div>
          </div>
        </div>

        <!-- Case 2: Authenticated but not verified -->
        <div v-else class="sm:mx-auto sm:w-full sm:max-w-md space-y-5">
          <div class="text-center">
            <h2 class="mt-6 text-3xl font-bold tracking-tight">
              {{ pageTitle }}
            </h2>
            <p class="mt-2 text-sm opacity-80">{{ pageDescription }}</p>
          </div>

          <div class="box-shadow-card p-8">
            <p class="mb-4">Your email: {{ user?.email }}</p>

            <!-- Messages -->
            <div v-if="message.text" class="mb-4">
              <p
                class="text-sm font-medium p-2 border rounded-md"
                :class="{
                  'text-green-700 bg-green-50 border-green-200':
                    message.type === 'success',
                  'text-red-700 bg-red-50 border-red-200':
                    message.type === 'error',
                }"
              >
                {{ message.text }}
              </p>
            </div>

            <!-- Resend Button -->
            <button
              class="inline-flex justify-center items-center rounded-md border border-(--border-color) px-4 py-2 font-medium shadow-[4px_4px_0_var(--shadow-color)] transition-all bg-(--primary-color) text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--primary-color)"
              :class="{
                ' cursor-not-allowed opacity-50':
                  isResendDisabled || isResending,
                'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--shadow-color)]':
                  !isResendDisabled && !isResending,
              }"
              :disabled="isResendDisabled || isResending"
              @click="handleResend"
            >
              <svg
                v-if="isResending"
                class="animate-spin -ml-1 mr-3 h-5 w-5 inline"
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
              {{ isResending ? "Resending..." : "Resend Verification Email" }}
            </button>

            <p v-if="lastResend" class="text-sm opacity-80 mt-2">
              Last resend: {{ lastResend.toLocaleTimeString() }} — wait 2
              minutes to resend again.
            </p>
          </div>
        </div>
      </div>
    </main>
  </component>
</template>
