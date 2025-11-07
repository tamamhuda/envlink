<template>
  <div
    class="w-full flex items-center justify-center min-h-full bg-[var(--bg-color)] transition-colors duration-300"
  >
    <div v-if="!isClientOnly"><Loading /></div>
    <div v-else class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="not-italic text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight">
          {{ pageTitle }}
        </h2>
        <p class="mt-2 text-sm">
          {{ pageDescription }}
        </p>
      </div>

      <div
        class="mt-8 py-8 px-4 shadow-[4px_4px_0_var(--text-color)] sm:rounded-lg sm:px-10 border border-[var(--text-color)] bg-[var(--bg-color)] transition-colors text-center"
      >
        <p class="mb-4">Your email: {{ user?.email }}</p>

        <button
          :disabled="isResendDisabled"
          class="mb-2 flex-1 rounded-md border border-[var(--text-color)] px-4 py-2 font-medium shadow-[4px_4px_0_var(--text-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)] transition-all bg-transparent"
          @click="resendVerification"
        >
          Resend Verification Email
        </button>

        <p v-if="lastResend" class="text-sm opacity-80">
          Last resend: {{ lastResend.toLocaleTimeString() }}. Wait until 2
          minutes from last resend.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { navigateTo, useRoute } from "#app";
import { definePageMeta, useAuthStore } from "#imports";

const auth = useAuthStore();

const user = ref(auth.user);
const isClientOnly = ref(false);
const lastResend = ref<Date | null>(null);

const route = useRoute();

// Only show "Registration Successful" if query=register AND last_login_at is null
const fromRegister = computed(
  () => route.query.from === "register" && user.value?.last_login_at == null,
);

const pageTitle = computed(() =>
  fromRegister.value
    ? "Registration Successful"
    : "Account Verification Required",
);
const pageDescription = computed(() =>
  fromRegister.value
    ? "You have successfully registered. Please verify your email to activate your account."
    : "Your account is not verified. Please verify your email to access all features.",
);

const isResendDisabled = computed(() => {
  if (!lastResend.value) return false;
  return Date.now() - lastResend.value.getTime() < 120_000;
});

const resendVerification = async () => {
  if (isResendDisabled.value) return;
  // await auth.resendVerificationEmail();
  lastResend.value = new Date();
};

onMounted(async () => {
  if (import.meta.client) {
    // await auth.initializeAuth();
    user.value = auth.user;
    isClientOnly.value = true;

    if (!auth.isAuthenticated) {
      navigateTo("/error/401");
    }

    // If already verified, redirect
    if (user.value?.providers.is_verified) {
      navigateTo("/dashboard");
    }

    // If error occurred during fetch, redirect to error page
  }
});

definePageMeta({
  layout: "authenticated",
});
</script>
