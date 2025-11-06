<template>
  <div
    class="flex w-full min-h-full flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight">
        Sign in to your account
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="py-8 px-4 shadow-[4px_4px_0_var(--text-color)] sm:rounded-lg sm:px-10 border border-[var(--text-color)] bg-[var(--bg-color)] transition-colors"
      >
        <form class="space-y-6" @submit.prevent="handleLogin">
          <FormInput
            id="username"
            v-model="credentials.username"
            label="Username"
            type="text"
            required
          />

          <FormInput
            id="password"
            v-model="credentials.password"
            label="Password"
            type="password"
            required
          />

          <div>
            <button
              type="submit"
              class="inline-block w-full rounded-md border border-[var(--text-color)] px-4 py-2 font-medium shadow-[4px_4px_0_var(--text-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)] transition-all bg-transparent text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-color)]"
            >
              Sign in
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-[var(--border-color)]" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span
                class="bg-[var(--bg-color)] px-2 text-[var(--text-color)] opacity-70 transition-colors"
              >
                Or continue with
              </span>
            </div>
          </div>

          <div class="mt-6">
            <NuxtLink
              to="/register"
              class="block text-center font-medium text-[var(--text-color)] opacity-80 hover:opacity-100 transition-colors"
            >
              Don't have an account? Register here.
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useAuthStore } from "#imports";
import { reactive } from "vue";
import type { components } from "~/types/api";

definePageMeta({
  layout: "auth",
});

const authStore = useAuthStore();

const credentials = reactive<components["schemas"]["LoginBodyDto"]>({
  username: "",
  password: "",
});

const handleLogin = async () => {
  try {
    await authStore.login(credentials);
  } catch (error: any) {
    console.log(error.response.data);
  }
};
</script>
