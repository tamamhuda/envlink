<script setup lang="ts">
import { definePageMeta, onMounted } from "#imports";
import { ref } from "vue";

const loading = ref(true);

definePageMeta({
  layout: "main",
});

onMounted(async () => {
  loading.value = false;
});
</script>

<template>
  <div
    class="flex flex-1 min-h-full items-center justify-center transition-colors duration-300"
  >
    <!-- <Loading v-if="loading" /> -->
  </div>
</template>
