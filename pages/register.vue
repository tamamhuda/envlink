<template>
  <div
    class="flex w-full flex-col sm:flex-row items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] transition-colors"
  >
    <!-- Left Info Section -->
    <div
      class="hidden sm:flex flex-1 flex-col items-center justify-center px-8 lg:px-16 border-r border-[var(--border-color)]"
    >
      <div class="max-w-md text-center">
        <h1 class="text-4xl font-bold mb-4 tracking-tight">
          Welcome to Envlink
        </h1>
        <p class="text-base opacity-80 mb-8">
          Create an account to shorten, track, and manage your links with ease.
          Our platform helps you organize and optimize your link performance.
        </p>
        <ul class="space-y-3 text-left inline-block text-sm opacity-90">
          <li>• Real-time analytics for your shortened links</li>
          <li>• Custom aliases and branded domains</li>
          <li>• Secure and scalable API for developers</li>
        </ul>
      </div>
    </div>

    <!-- Right Form Section -->
    <div class="flex flex-1 items-center justify-center py-12 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 class="text-center text-3xl font-bold tracking-tight">
            Register a new account
          </h2>
        </div>

        <div
          class="py-8 px-4 border border-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)] sm:rounded-lg sm:px-10 bg-[var(--bg-color)] transition-colors"
        >
          <form class="space-y-6" @submit.prevent="handleRegister">
            <div
              v-if="errorMessage"
              class="rounded-md bg-red-50 p-4 border border-red-200"
            >
              <p class="text-sm font-medium text-center text-red-800">
                {{ errorMessage }}
              </p>
            </div>
            <FormInput
              id="full_name"
              v-model="registrationForm.full_name"
              label="Full Name"
              type="text"
              required
            />

            <FormInput
              id="username"
              v-model="registrationForm.username"
              label="Username"
              type="text"
              required
            />

            <FormInput
              id="email"
              v-model="registrationForm.email"
              label="Email address"
              type="email"
              required
            />

            <FormInput
              id="password"
              v-model="registrationForm.password"
              label="Password"
              type="password"
              required
            />

            <FormInput
              id="confirm_password"
              v-model="registrationForm.confirm_password"
              label="Confirm Password"
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
                {{ isLoading ? "Registering..." : "Register" }}
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
                  class="bg-[var(--bg-color)] px-2 text-[var(--text-color)] opacity-70"
                >
                  Or continue with
                </span>
              </div>
            </div>

            <div class="mt-6">
              <NuxtLink
                to="/login"
                class="block text-center font-medium text-[var(--text-color)] opacity-80 hover:opacity-100 transition-opacity"
              >
                Already have an account? Sign in here.
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useAuthStore } from "#imports";
import { reactive, ref } from "vue";
import type { components } from "~/types/api";

definePageMeta({
  layout: "auth",
});

const authStore = useAuthStore();
const isLoading = ref(false);
const errorMessage = ref("");

const registrationForm = reactive<components["schemas"]["RegisterBodyDto"]>({
  full_name: "",
  username: "",
  email: "",
  password: "",
  confirm_password: "",
});

const handleRegister = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    await authStore.register(registrationForm);
  } catch (error: any) {
    if (error.data && error.data.message) {
      errorMessage.value = Array.isArray(error.data.message)
        ? error.data.message.join(", ")
        : error.data.message;
    } else {
      errorMessage.value = "An unexpected error occurred.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
