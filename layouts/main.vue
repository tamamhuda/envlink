<template>
  <NuxtLayout name="default">
    <slot />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { navigateTo, useAuthStore } from "#imports";
import { computed, watch } from "vue";
const auth = useAuthStore();

const isAuthenticated = computed(() => auth.isAuthenticated);

watch(isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    navigateTo("/dashboard");
  }
});
</script>
