<template>
  <Content :is-ready="!isClientReady && hasCookie">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="mt-6">
        <h2 class="text-3xl font-bold tracking-tight">Session Expired</h2>
        <p class="mt-2 text-sm opacity-80">
          Your session is missing or has expired. Please log in again to
          continue.
        </p>
      </div>

      <div
        class="mt-8 py-8 px-4 shadow-[4px_4px_0_var(--shadow-color)] sm:rounded-lg sm:px-10 border border-[--border-color] bg-[--bg-color] transition-colors"
      >
        <button
          class="rounded-md border border-[--border-color] px-4 py-2 font-medium shadow-[4px_4px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--shadow-color)] transition-all bg-transparent text-[--text-color]"
          @click="redirectToLogin"
        >
          Back to Login
        </button>

        <p v-if="lastChecked" class="mt-4 text-sm opacity-70">
          Checked at: {{ lastChecked.toLocaleTimeString() }}
        </p>
      </div>
    </div>
  </Content>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { navigateTo } from "#app";
import { computed, definePageMeta, useAuthStore } from "#imports";

import Content from "~/components/Content.vue";

const auth = useAuthStore();
const hasCookie = computed(() => auth.hasCookie() || false);
const isClientReady = ref(false);
const lastChecked = ref<Date | null>(null);

const redirectToLogin = async () => {
  auth.clearAuth();
  await navigateTo("/login");
};

onMounted(async () => {
  if (!import.meta.client) return;

  isClientReady.value = true;
  lastChecked.value = new Date();

  // If the user is somehow logged in, redirect them to dashboard instead
  if (auth.isAuthenticated) {
    await navigateTo("/dashboard");
  }
});

definePageMeta({
  layout: "authenticated",
});
</script>
