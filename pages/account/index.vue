<script setup lang="ts">
import { definePageMeta, onMounted, ref, useAuthStore } from "#imports";
import { Github, Bot, Pencil } from "lucide-vue-next";
import Content from "~/components/Content.vue";

definePageMeta({
  layout: "account",
});

const { user } = useAuthStore();
const isReady = ref(false);

onMounted(async () => {
  isReady.value = true;
});

// Placeholder for linked accounts.
// In a real app, this would come from the user object or a dedicated API call.
const linkedAccounts = [
  { name: "Google", icon: Bot, connected: false },
  { name: "GitHub", icon: Github, connected: false },
];
</script>

<template>
  <Content :is-ready="isReady && Boolean(user)">
    <div class="space-y-8">
      <!-- Profile Section -->
      <div
        class="rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium leading-6">Account Information</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your personal information.
            </p>
          </div>
          <NuxtLink
            to="/account/profile"
            class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 dark:bg-blue-700/80 shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none"
            :class="{
              'hover:translate-x-[2px] hover:translate-y-[2px] ': true,
            }"
            ><Pencil class="w-4 h-4" /> <span>Edit</span></NuxtLink
          >
        </div>
        <div
          v-if="user"
          class="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
        >
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Full Name
            </p>
            <p class="mt-1">{{ user.full_name }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Username
            </p>
            <p class="mt-1">{{ user.username }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Email
            </p>
            <p class="mt-1">{{ user.email }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Phone Number
            </p>
            <p class="mt-1">{{ user.phone_number || "Not provided" }}</p>
          </div>
        </div>
      </div>

      <!-- Linked Accounts Section -->
      <div
        class="rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
      >
        <h3 class="text-lg font-medium leading-6">Linked Accounts</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Connect your social accounts to sign in.
        </p>
        <div class="mt-6 space-y-4">
          <div
            v-for="account in linkedAccounts"
            :key="account.name"
            class="relative flex items-center justify-between px-5 py-4 border border-[var(--text-color)] rounded-md bg-transparent text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)] hover:bg-gray-200 dark:hover:bg-gray-800/50"
          >
            <div class="flex items-center">
              <component :is="account.icon" class="w-6 h-6 mr-4" />
              <span class="font-medium">{{ account.name }}</span>
            </div>
            <button
              v-if="account.connected"
              class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Disconnect
            </button>
            <button
              v-else
              class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 dark:bg-blue-700/80 text-white shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  </Content>
</template>
