<template>
  <div
    class="flex flex-1 w-full h-full flex-col text-[var(--text-color)] transition-colors duration-300"
  >
    <div class="flex items-center space-x-2 px-6 pt-6">
      <template v-for="(item, index) in breadcrumbs" :key="item.name">
        <div class="flex items-center space-x-2">
          <component :is="item.icon" class="w-5 h-5" />
          <NuxtLink :to="item.href" class="text-lg font-medium">{{
            item.name
          }}</NuxtLink>
        </div>
        <ChevronRight v-if="index < breadcrumbs.length - 1" class="w-5 h-5" />
      </template>
    </div>
    <main class="flex flex-1 max-w-7xl py-6 sm:px-6 lg:px-8">
      <div v-if="isReady" class="w-full">
        <slot />
      </div>
      <div v-else class="flex justify-center items-center w-full">
        <Loading />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useMenu } from "~/composables/useMenu";
import { ChevronRight } from "lucide-vue-next";

defineProps<{
  isReady: boolean;
}>();

const route = useRoute();
const { dashboardMenu, accountMenu } = useMenu();

const allMenus = [...dashboardMenu, ...accountMenu];

const breadcrumbs = computed(() => {
  const pathParts = route.path.split("/").filter(Boolean);
  const crumbs = [];

  let currentPath = "";
  for (const part of pathParts) {
    currentPath += `/${part}`;
    const menuItem = allMenus.find((item) => item.href === currentPath);
    if (menuItem) {
      crumbs.push(menuItem);
    }
  }
  return crumbs;
});
</script>
