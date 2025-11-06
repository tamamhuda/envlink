<script setup lang="ts">
import { definePageMeta } from "#imports";
import { ref } from "vue";

const loading = ref(true);

definePageMeta({
  layout: "main",
});
</script>

<template>
  <div
    class="flex flex-1 min-h-full items-center justify-center transition-colors duration-300"
  >
    <!-- <Loading v-if="loading" /> -->
  </div>
</template>
