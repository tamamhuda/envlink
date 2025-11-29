<script setup lang="ts">
import {
  computed,
  navigateTo,
  onMounted,
  onUnmounted,
  ref,
  useAccountApi,
  useAuthStore,
  useRoute,
  useTheme,
} from "#imports";
import {
  Menu,
  User,
  Pencil,
  CreditCard,
  LogOut,
  Settings,
  Sun,
  Moon,
} from "lucide-vue-next";

import { useSidebar } from "~/composables/useSidebar";
import ActionDropdown from "~/components/common/ActionDropdown.vue";

const { toggle: toggleSidebar } = useSidebar();
const isClientOnly = ref(false);
const auth = useAuthStore();
const accountApi = useAccountApi();
const { logout } = await accountApi.logout();
const { user } = auth;
const route = useRoute();

// Dropdowns
const isDropdownOpen = ref(false);
const isNotifOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const notifRef = ref<HTMLElement | null>(null);
const isVerified = computed(() => user?.providers.isVerified || false);
const isAuthenticated = computed(() => auth.isAuthenticated);

const isUpgradePage = computed(() =>
  route.path.includes("/account/subscriptions/upgrade")
);

// Mock notifications
const notifications = ref([
  { title: "Server usage exceeded 80%", time: "2 minutes ago" },
  { title: "New login detected from Chrome", time: "1 hour ago" },
  { title: "Subscription renewed successfully", time: "Yesterday" },
]);
const unreadCount = computed(() => notifications.value.length);

// Theme State
const { isDarkMode, toggleTheme } = useTheme();

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
  if (!isAuthenticated.value) {
    auth.clearAuth();
    return await navigateTo("/login");
  }
  await logout();
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
    class="flex flex-col h-screen overflow-hidden text-(--text-color) transition-colors"
  >
    <!-- Header -->
    <header
      class="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-(--border-color) w-full bg-(--bg-color) z-50 shrink-0"
    >
      <button
        class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800/50"
        :class="{ 'lg:hidden': !isUpgradePage }"
        @click="toggleSidebar"
      >
        <Menu class="w-6 h-6" />
      </button>
      <!-- Brand -->
      <div class="flex-1 justify-start flex pl-2">
        <NuxtLink
          to="/dashboard"
          class="rounded-md font-medium flex items-center gap-2"
        >
          <div>
            <img
              src="/icons/envlink-light.svg"
              alt="Envlink Logo"
              class="h-10 block dark:hidden"
            />
            <img
              src="/icons/envlink-dark.svg"
              alt="Envlink Logo"
              class="h-10 hidden dark:block"
            />
          </div>
          <h1 class="text-xl font-semibold tracking-tight text-(--text-color)">
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
            class="button-box-small px-4 py-1.5 text-base font-medium"
          >
            Upgrade
          </NuxtLink>
          <NuxtLink
            v-if="isUpgradePage"
            to="/dashboard"
            class="button-box-small px-4 py-1.5 text-base font-medium"
          >
            Dashboard
          </NuxtLink>
        </nav>

        <!-- Theme Toggle -->
        <button
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle Theme"
          @click="toggleTheme"
        >
          <div class="relative w-5 h-5">
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="transform rotate-90 opacity-0 scale-50"
              enter-to-class="transform rotate-0 opacity-100 scale-100"
              leave-active-class="transition duration-300 ease-in"
              leave-from-class="transform rotate-0 opacity-100 scale-100"
              leave-to-class="transform -rotate-90 opacity-0 scale-50"
            >
              <Sun
                v-if="isDarkMode"
                class="w-5 h-5 absolute inset-0 text-orange-500"
              />
              <Moon v-else class="w-5 h-5 absolute inset-0 text-blue-400" />
            </Transition>
          </div>
        </button>

        <!-- Notifications -->
        <div ref="notifRef" class="relative">
          <button
            :disabled="isClientOnly && !isAuthenticated"
            class="relative flex items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
              class="absolute right-0 mt-6 min-w-sm box-shadow-card"
            >
              <div
                class="px-4 min-h-12 flex items-center border-b border-(--border-color) font-medium text-sm"
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
                  class="px-4 py-3 flex flex-col items-start border-b border-(--border-color)/30 min-h-18 last:border-0 hover:bg-(--shadow-color)/20 dark:hover:bg-gray-800 transition-colors"
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
        <div ref="dropdownRef">
          <ActionDropdown
            :is-open="isDropdownOpen"
            dropdown-class="w-56"
            @toggle="toggleDropdown"
            @close="closeDropdown"
          >
            <template #trigger>
              <button
                class="flex items-center rounded-md py-0.5 gap-2 hover:opacity-90 transition-opacity"
                aria-label="User menu"
              >
                <img
                  v-if="isClientOnly && user?.avatar"
                  :src="user.avatar"
                  :alt="user.fullName || user.username"
                  class="w-8 h-8 rounded-full object-cover border border-(--border-color)"
                />
                <div
                  v-else
                  class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium"
                >
                  <div v-if="user && isClientOnly">
                    {{ getInitials(user.fullName || user.username) }}
                  </div>
                  <div v-else>U</div>
                </div>
              </button>
            </template>

            <div
              v-if="isClientOnly && isAuthenticated"
              class="px-4 py-3 border-b border-(--border-color)"
            >
              <p class="text-sm font-medium">
                {{ user?.fullName || user?.username }}
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
              v-if="isClientOnly && isAuthenticated"
              to="/account/settings"
              class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors no-underline"
              @click="closeDropdown"
            >
              <Settings class="w-4 h-4" />
              <span>Settings</span>
            </NuxtLink>

            <NuxtLink
              v-if="isVerified"
              to="/account/subscriptions"
              class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors no-underline"
              @click="closeDropdown"
            >
              <CreditCard class="w-4 h-4" />
              <span> Subscriptions</span>
            </NuxtLink>

            <button
              class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left text-red-600 dark:text-red-400"
              @click="handleLogout"
            >
              <LogOut class="w-4 h-4" />
              <span>Logout</span>
            </button>
          </ActionDropdown>
        </div>
      </div>
    </header>

    <main
      class="mx-auto w-full 2xl:max-w-[95vw] overflow-y-auto flex-1 flex flex-col"
    >
      <slot />
    </main>
  </div>
</template>
