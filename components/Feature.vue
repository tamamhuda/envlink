<template>
  <div
    class="border border-[var(--border-color)] rounded-md p-4 max-w-xs w-full text-center hover:bg-[var(--hover-bg)] transition"
  >
    <h4 class="font-medium mb-2">{{ title }}</h4>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>
