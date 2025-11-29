<template>
  <div
    class="flex flex-1 flex-col min-h-full text-(--text-color) transition-colors duration-300"
  >
    <div class="flex items-center space-x-2 sm:px-4 lg:px-8 pt-6">
      <template v-for="(item, index) in breadcrumbs" :key="item.name">
        <div class="flex items-center space-x-2">
          <component
            :is="index < breadcrumbs.length - 1 ? NuxtLink : 'div'"
            v-bind="index < breadcrumbs.length - 1 ? { to: item.href } : {}"
            class="flex items-center space-x-2 text-lg font-medium"
            :class="{
              'hover:underline opacity-90 cursor-pointer':
                index < breadcrumbs.length - 1,
              ' cursor-default': index === breadcrumbs.length - 1,
            }"
          >
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
            <span
              :class="{
                'hidden sm:inline':
                  breadcrumbs.length > 2 &&
                  index > 0 &&
                  index < breadcrumbs.length - 1,
              }"
            >
              {{ item.name }}
            </span>
          </component>
        </div>
        <ChevronRight
          v-if="index < breadcrumbs.length - 1"
          class="w-5 h-5 shrink-0"
        />
      </template>
    </div>
    <client-only
      v-if="props.isReady"
      class="flex h-full w-full relative flex-1 py-6 sm:px-4 lg:px-8"
    >
      <div class="flex flex-1 flex-col">
        <slot />
      </div>
      <template #fallback>
        <div
          class="flex flex-1 justify-center items-center w-full h-full py-6 sm:px-4 lg:px-8"
        >
          <Loader />
        </div>
      </template>
    </client-only>

    <div
      v-if="!props.isReady"
      class="flex flex-1 justify-center items-center w-full h-full py-6 sm:px-4 lg:px-8"
    >
      <Loader />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useMenu } from "~/composables/useMenu";
import { ChevronRight } from "lucide-vue-next";
import { NuxtLink } from "#components";
import Loader from "./Loader.vue";
import { template } from "lodash";

const props = defineProps({
  isReady: { type: Boolean, default: true },
});

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
    if (menuItem) crumbs.push(menuItem);
  }
  return crumbs;
});
</script>
