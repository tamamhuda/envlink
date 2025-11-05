<template>
  <div
    class="w-full flex items-center justify-center min-h-full bg-[var(--bg-color)] transition-colors duration-300"
  >
    <div v-if="user && !isVerified">
      <div class="sm:mx-auto sm:w-full sm:max-w-md not-italic">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight">
          Registration Successful
        </h2>
        <p class="mt-2 text-center text-sm">
          Please verify your email to activate your account
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          class="py-8 w-f px-4 shadow-[4px_4px_0_var(--text-color)] sm:rounded-lg sm:px-10 border border-[var(--text-color)] bg-[var(--bg-color)] transition-colors text-center"
        >
          <h3 class="text-xl font-semibold mb-2">
            Welcome, {{ user.full_name }}!
          </h3>
          <p class="mb-2">Your email: {{ user.email }}</p>
          <p class="mt-4 text-sm opacity-80">
            We’ve sent a verification link to your inbox. Please check your
            email and follow the instructions.
          </p>

          <div class="mt-8 mb-4 w-full flex justify-center">
            <NuxtLink
              to="/login"
              class="flex-1 rounded-md border border-[var(--text-color)] px-4 py-2 font-medium shadow-[4px_4px_0_var(--text-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)] transition-all bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-color)]"
            >
              Back to Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div v-else><Loading /></div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { definePageMeta, useAuthStore } from "#imports";
import { computed, onMounted } from "vue";

definePageMeta({
  layout: "empty",
});

const auth = useAuthStore();
const isVerified =
  computed(() => auth.user?.providers.is_verified).value || false;
const user = computed(() => auth.user);

onMounted(async () => {
  await auth.fetchUser();
  if (isVerified) {
    navigateTo("/dashboard");
  }
});
</script>
