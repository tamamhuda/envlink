<template>
  <div
    class="flex flex-col min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300"
  >
    <!-- Header -->
    <header
      class="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-[var(--border-color)] max-w-[960px] mx-auto w-full"
    >
      <!-- Brand -->
      <NuxtLink
        to="/dashboard"
        class="flex items-center gap-2 hover:opacity-90 transition-opacity no-underline"
      >
        <h1
          class="text-xl font-semibold tracking-tight text-[var(--text-color)]"
        >
          Stativio
        </h1>
      </NuxtLink>

      <!-- Actions -->
      <div class="flex items-center gap-5">
        <!-- Navigation -->
        <nav class="hidden sm:flex items-center gap-4 text-sm font-medium">
          <NuxtLink
            to="/settings"
            class="no-underline text-[var(--text-color)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Settings
          </NuxtLink>
        </nav>

        <!-- Notifications -->
        <div ref="notifRef" class="relative">
          <button
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
              class="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-[var(--border-color)] rounded-lg shadow-lg z-50"
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
              class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-[var(--border-color)] rounded-lg shadow-lg py-1 z-50"
            >
              <div class="px-4 py-3 border-b border-[var(--border-color)]">
                <p class="text-sm font-medium">
                  {{ user?.full_name || user?.username }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ user?.email }}
                </p>
              </div>

              <NuxtLink
                to="/profile"
                class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors no-underline"
                @click="closeDropdown"
              >
                <span>Profile</span>
              </NuxtLink>

              <NuxtLink
                to="/settings"
                class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors no-underline"
                @click="closeDropdown"
              >
                <span>Settings</span>
              </NuxtLink>

              <div class="border-t border-[var(--border-color)] mt-1"></div>

              <button
                class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left text-red-600 dark:text-red-400"
                @click="handleLogout"
              >
                Logout
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main
      class="text-center p-6 sm:p-12 max-w-[900px] min-h-full flex mx-auto flex-1 w-full"
    >
      <slot />
    </main>

    <!-- Footer -->
    <footer
      class="border-t border-[var(--border-color)] text-center py-4 text-sm mt-auto max-w-[960px] mx-auto w-full text-gray-600 dark:text-gray-400"
    >
      © <span>{{ year }}</span> Stativio. Conscious uptime detected.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAuthStore } from "~/composables/useAuth";
const isClientOnly = ref(false);

const { user, logout } = useAuthStore();
const year = new Date().getFullYear();

// Dropdowns
const isDropdownOpen = ref(false);
const isNotifOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const notifRef = ref<HTMLElement | null>(null);

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

const handleLogout = () => {
  closeDropdown();
  logout();
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
