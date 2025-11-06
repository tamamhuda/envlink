<template>
  <div
    class="flex w-full min-h-full flex-col text-[var(--text-color)] transition-colors duration-300"
  >
    <!-- Main content -->
    <main class="min-h-full w-full flex flex-1 max-w-7xl py-6 sm:px-6 lg:px-8">
      <div v-if="!isClientOnly">
        <Loading />
      </div>

      <div v-else-if="user" class="w-full inset-0 px-4 py-6 sm:px-0">
        <div
          class="w-fullrounded-lg border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-color)] p-6 shadow-sm transition-colors"
        >
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Welcome, {{ user.full_name }}
          </h3>
          <div class="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p>Email: {{ user.email }}</p>
            <p>Username: {{ user.username }}</p>
            <p v-if="user.phone_number">Phone: {{ user.phone_number }}</p>
            <p>Role: {{ user.role }}</p>
          </div>
        </div>
      </div>

      <div v-else class="px-4 py-6 sm:px-0">
        <p class="text-gray-600 dark:text-gray-400">
          User not found or session expired.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useAuthStore } from "#imports";
import { ref, onMounted } from "vue";

const { user } = useAuthStore();
const isClientOnly = ref(false);

definePageMeta({
  layout: "dashboard",
});

onMounted(async () => {
  if (import.meta.client) {
    isClientOnly.value = true;
  }
});
</script>
