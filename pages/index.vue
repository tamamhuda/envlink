<script setup lang="ts">
import { navigateTo } from "#app";
import { useAuthStore } from "#imports";
import { ref, onMounted } from "vue";

const authStore = useAuthStore();
const loading = ref(true);

onMounted(async () => {
  try {
    if (authStore.isAuthenticated) {
      await navigateTo("/dashboard");
    } else {
      await navigateTo("/login");
    }
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div
    class="flex flex-1 min-h-full items-center justify-center transition-colors duration-300"
  >
    <Loading v-if="loading" />

    <div v-else class="text-center">
      <h1 class="text-lg font-medium opacity-90">Reinitialising...</h1>
    </div>
  </div>
</template>
