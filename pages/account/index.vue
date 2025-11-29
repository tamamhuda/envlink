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
      <div class="box-inner-card p-4 sm:p-8">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium leading-6">Account Information</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your personal information.
            </p>
          </div>
          <NuxtLink
            to="/account/profile"
            class="button-box hover:translate-x-0.5 hover:translate-y-0.5"
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
            <p class="mt-1">{{ user.fullName }}</p>
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
            <p class="mt-1">{{ user.phoneNumber || "Not provided" }}</p>
          </div>
        </div>
      </div>

      <!-- Linked Accounts Section -->
      <div class="box-inner-card p-4 sm:p-8">
        <h3 class="text-lg font-medium leading-6">Linked Accounts</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Connect your social accounts to sign in.
        </p>
        <div class="mt-6 space-y-4">
          <div
            v-for="account in linkedAccounts"
            :key="account.name"
            class="card-box"
          >
            <div class="flex items-center">
              <component :is="account.icon" class="w-6 h-6 mr-4" />
              <span class="font-medium">{{ account.name }}</span>
            </div>
            <button v-if="account.connected" class="button-box danger">
              Disconnect
            </button>
            <button v-else class="button-box">Connect</button>
          </div>
        </div>
      </div>
    </div>
  </Content>
</template>
