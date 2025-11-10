<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  useAccountApi,
  useAuthStore,
  useRoute,
} from "#imports";
import { Menu, User, Pencil, CreditCard, LogOut } from "lucide-vue-next";

import { useSidebar } from "~/composables/useSidebar";

const { toggle: toggleSidebar } = useSidebar();
const isClientOnly = ref(false);
const auth = useAuthStore();
const accountApi = useAccountApi();
const { fetchLogout } = await accountApi.useFetchLogout();
const { user } = auth;
const year = new Date().getFullYear();
const route = useRoute();

// Dropdowns
const isDropdownOpen = ref(false);
const isNotifOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const notifRef = ref<HTMLElement | null>(null);
const isVerified = computed(() => user?.providers.is_verified || false);
const isAuthenticated = computed(() => auth.isAuthenticated);

const isUpgradePage = computed(
  () => route.path === "/account/subscriptions/upgrade",
);

// Mock notifications
const notifications = ref([
  { title: "Server usage exceeded 80%", time: "2 minutes ago" },
  { title: "New login detected from Chrome", time: "1 hour ago" },
  { title: "Subscription renewed successfully", time: "Yesterday" },
]);
const unreadCount = computed(() => notifications.value.length);

// --- Logic ---
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) isNotifOpen.value = false;
};
const closeDropdown = () => (isDropdownOpen.value = false);

const toggleNotifications = () => {
  isNotifOpen.value = !isNotifOpen.value;
  if (isNotifOpen.value) isDropdownOpen.value = false;
};

const handleLogout = async () => {
  closeDropdown();
  await fetchLogout();
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node) &&
    notifRef.value &&
    !notifRef.value.contains(event.target as Node)
  ) {
    isDropdownOpen.value = false;
    isNotifOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  if (import.meta.client) {
    isClientOnly.value = true;
  }
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div
    class="flex flex-col min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300"
  >
    <!-- Header -->
    <header
      class="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-[var(--border-color)] max-w-full mx-auto w-full"
    >
      <button
        v-if="!isUpgradePage"
        class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800/50 md:hidden"
        @click="toggleSidebar"
      >
        <Menu class="w-6 h-6" />
      </button>
      <!-- Brand -->
      <div
        class="flex-1 md:flex-none md:justify-center md:w-72 flex justify-center items-center"
      >
        <NuxtLink to="/dashboard" class="rounded-md font-medium">
          <h1
            class="text-xl font-semibold tracking-tight text-[var(--text-color)]"
          >
            Envlink
          </h1>
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-5">
        <!-- Navigation -->
        <nav class="hidden sm:flex items-center gap-4 text-sm font-medium">
          <NuxtLink
            v-if="isClientOnly && isVerified && !isUpgradePage"
            to="/account/subscriptions/upgrade"
            class="no-underline rounded-md border border-[var(--text-color)] px-4 py-2 text-sm font-medium shadow-[2px_2px_0_var(--text-color)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_var(--text-color)] transition-all"
          >
            Upgrade
          </NuxtLink>
          <NuxtLink
            v-if="isUpgradePage"
            to="/dashboard"
            class="no-underline rounded-md border border-[var(--text-color)] px-4 py-2 text-sm font-medium shadow-[2px_2px_0_var(--text-color)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_var(--text-color)] transition-all"
          >
            Dashboard
          </NuxtLink>
        </nav>

        <!-- Notifications -->
        <div ref="notifRef" class="relative">
          <button
            :disabled="isClientOnly && !isAuthenticated"
            class="relative flex items-center justjustify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Notifications"
            @click="toggleNotifications"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              v-if="unreadCount > 0"
              class="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"
            ></span>
          </button>

          <!-- Notification Dropdown -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isNotifOpen"
              class="absolute right-0 mt-2 w-72 bg-[var(--bg-color)] border border-[var(--text-color)] rounded-lg shadow-[4px_4px_0_var(--text-color)] z-50"
            >
              <div
                class="px-4 py-2 border-b border-[var(--border-color)] font-medium text-sm"
              >
                Notifications
              </div>
              <div
                v-if="notifications.length > 0"
                class="max-h-64 overflow-y-auto"
              >
                <div
                  v-for="(notif, index) in notifications"
                  :key="index"
                  class="px-4 py-3 border-b border-[var(--border-color)] last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <p class="text-sm font-medium">{{ notif.title }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ notif.time }}
                  </p>
                </div>
              </div>
              <div
                v-else
                class="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
              >
                No new notifications
              </div>
            </div>
          </Transition>
        </div>

        <!-- User Dropdown -->
        <div ref="dropdownRef" class="relative">
          <button
            class="flex items-center rounded-md py-0.5 gap-2 hover:opacity-90 transition-opacity"
            aria-label="User menu"
            @click="toggleDropdown"
          >
            <img
              v-if="user?.avatar"
              :src="user.avatar"
              :alt="user.full_name || user.username"
              class="w-8 h-8 rounded-full object-cover border border-[var(--border-color)]"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium"
            >
              <div v-if="user && isClientOnly">
                {{ getInitials(user.full_name || user.username) }}
              </div>
              <div v-else>U</div>
            </div>
          </button>

          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-56 bg-[var(--bg-color)] border border-[var(--text-color)] rounded-lg shadow-[4px_4px_0_var(--text-color)] py-1 z-[99]"
            >
              <div
                v-if="isClientOnly && isAuthenticated"
                class="px-4 py-3 border-b border-[var(--border-color)]"
              >
                <p class="text-sm font-medium">
                  {{ user?.full_name || user?.username }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ user?.email }}
                </p>
              </div>

              <NuxtLink
                v-if="isClientOnly && isAuthenticated"
                to="/account"
                class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors no-underline"
                @click="closeDropdown"
              >
                <User class="w-4 h-4" />
                <span>Account</span>
              </NuxtLink>

              <NuxtLink
                v-if="isClientOnly && isAuthenticated"
                to="/account/profile"
                class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors no-underline"
                @click="closeDropdown"
              >
                <Pencil class="w-4 h-4" />
                <span>Profile</span>
              </NuxtLink>

              <NuxtLink
                v-if="isVerified"
                to="/account/subscriptions/manage"
                class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors no-underline"
                @click="closeDropdown"
              >
                <CreditCard class="w-4 h-4" />
                <span> Subscriptions</span>
              </NuxtLink>

              <!-- <div class="border-t border-[var(--border-color)] mt-1"></div> -->

              <button
                class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left text-red-600 dark:text-red-400"
                @click="handleLogout"
              >
                <LogOut class="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <slot />

    <!-- Footer -->
    <footer
      class="border-t border-[var(--border-color)] text-center py-4 text-sm mt-auto max-w-[960px] mx-auto w-full text-gray-600 dark:text-gray-400"
    >
      © <span>{{ year }}</span> Stativio. Conscious uptime detected.
    </footer>
  </div>
</template>
