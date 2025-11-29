<script setup lang="ts">
import { useSidebar } from "~/composables/useSidebar";
import { useMenu } from "~/composables/useMenu";
import { useRoute } from "vue-router";
import { computed } from "vue";

const { isSidebarOpen, toggle: toggleSidebar } = useSidebar();
const { accountMenu } = useMenu();
const route = useRoute();
const isUpgradePage = computed(() =>
  route.path.startsWith("/account/subscriptions/upgrade")
);
</script>

<template>
  <NuxtLayout name="authenticated">
    <div class="flex flex-1 h-full text-(--text-color)">
      <!-- Sidebar -->
      <aside
        :class="[
          'fixed left-0 z-40 p-4 w-72 -translate-x-full',
          'shrink-0 overflow-y-auto  transition-transform duration-300 ease-in-out',
          !isUpgradePage &&
            'lg:relative lg:z-auto lg:translate-x-0 inset-y-20 lg:inset-10',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
        role="navigation"
        aria-label="Sidebar"
      >
        <div class="flex flex-col">
          <div class="flex-1 py-6 px-5 space-y-2 box-shadow-card">
            <NuxtLink
              v-for="item in accountMenu.filter((i) => !i.hide)"
              :key="item.name"
              :to="item.href"
              class="flex items-center flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all sidebar-item"
              :class="
                (
                  item.href === '/account'
                    ? $route.path === '/account' ||
                      $route.path === '/account/profile'
                    : $route.path.startsWith(item.href)
                )
                  ? 'active'
                  : ''
              "
              @click="toggleSidebar"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              <span>{{ item.name }}</span>
            </NuxtLink>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 flex w-full min-h-full p-6 sm:p-8">
        <slot />
      </main>

      <!-- Mobile Overlay -->
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 z-30 bg-black/30 lg:hidden"
        @click="toggleSidebar"
      ></div>
    </div>
  </NuxtLayout>
</template>
