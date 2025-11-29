<template>
  <div
    class="w-full flex items-center justify-center min-h-full bg-(--bg-color) transition-colors duration-300"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-10">
      <div class="mt-6">
        <h2 class="text-3xl text-(--text-color) font-bold tracking-tight">
          500 - Server Error
        </h2>
        <p class="mt-2 text-sm text-(--text-color) opacity-80">
          Oops! Something went wrong on our end. Please try again later.
        </p>
      </div>

      <button
        class="rounded-md border border-(--border-color) px-4 py-2 font-medium shadow-[4px_4px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--shadow-color)] transition-all bg-transparent"
        @click="goHome"
      >
        Go Home
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { definePageMeta } from "#imports";

const goHome = async () => {
  await navigateTo("/");
};

definePageMeta({
  layout: "empty",
});
</script>
