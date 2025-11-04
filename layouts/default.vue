<template>
  <div class="flex flex-col min-h-screen">
    <header
      class="flex justify-between items-center flex-wrap gap-2 px-8 py-4 border-b border-[var(--border-color)] max-w-[960px] mx-auto w-full"
    >
      <h1 class="text-xl font-semibold">Stativio</h1>
      <nav class="flex flex-wrap gap-4">
        <NuxtLink to="#status" class="hover:underline">Perception</NuxtLink>
        <NuxtLink to="#about" class="hover:underline">Essence</NuxtLink>
        <NuxtLink to="#contact" class="hover:underline">Echo</NuxtLink>
      </nav>
    </header>

    <main class="text-center p-12 max-w-[700px] mx-auto flex-1">
      <slot />
    </main>

    <footer
      class="border-t border-[var(--border-color)] text-center py-4 text-sm mt-auto max-w-[960px] mx-auto w-full"
    >
      © <span>{{ year }}</span> Stativio. Conscious uptime detected.
    </footer>
  </div>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>
