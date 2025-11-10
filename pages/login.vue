<template>
  <main
    class="text-center h-full items-center justify-center w-full flex flex-1 my-14"
  >
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
          <form
            class="space-y-6"
            @submit.prevent="handleLogin"
            @keydown.enter.prevent
          >
            <div
              v-if="errorMessage"
              class="rounded-md bg-red-50 p-4 border border-red-200"
            >
              <p class="text-sm font-medium text-center text-red-800">
                {{ errorMessage }}
              </p>
            </div>
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
                :disabled="isLoading"
                class="inline-flex w-full justify-center items-center rounded-md border border-[var(--text-color)] px-4 py-2 font-medium shadow-[4px_4px_0_var(--text-color)] transition-all bg-transparent text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-color)]"
                :class="{
                  'opacity-50 cursor-not-allowed': isLoading,
                  'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)]':
                    !isLoading,
                }"
              >
                <svg
                  v-if="isLoading"
                  class="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {{ isLoading ? "Signing in..." : "Sign in" }}
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
  </main>
</template>

<script setup lang="ts">
import { definePageMeta, useAuthApi } from "#imports";
import { reactive, ref } from "vue";

import type { components } from "~/types/api";

definePageMeta({
  layout: "main",
});

const authApi = useAuthApi();

const errorMessage = ref<string | null>(null);

const credentials = reactive<components["schemas"]["LoginBodyDto"]>({
  username: "",
  password: "",
});
const {
  login,
  pending: isLoading,
  error,
} = await authApi.useFetchLogin(credentials);

const handleLogin = async () => {
  await login();
  if (error.value) {
    console.log(error.value.data);
    errorMessage.value = error.value.data?.message || "An error occurred";
  }
};
</script>
