<template>
  <div
    class="flex flex-col justify-between border border-[var(--text-color)] rounded-lg p-6 shadow-[4px_4px_0_var(--text-color)] bg-[var(--bg-color)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)]"
  >
    <div>
      <h4 class="text-xl font-semibold mb-2">{{ name }}</h4>
      <p class="opacity-70 mb-4">{{ description }}</p>
      <p class="text-2xl font-bold mb-6">{{ price }}</p>

      <ul class="text-sm text-left opacity-80 space-y-2 mb-6">
        <li
          v-for="(feature, index) in features"
          :key="index"
          class="flex items-center gap-2"
        >
          <span class="w-2 h-2 bg-[var(--text-color)] rounded-full" />
          {{ feature }}
        </li>
      </ul>
    </div>

    <button
      class="inline-block w-full rounded-md border border-[var(--text-color)] px-4 py-2 font-medium shadow-[4px_4px_0_var(--text-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)] transition-all bg-transparent text-[var(--text-color)]"
    >
      {{ cta }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  description: string;
  price: string;
  features: string[];
  cta: string;
}>();
</script>
