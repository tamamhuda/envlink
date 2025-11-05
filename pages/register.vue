<template>
  <div
    class="flex w-full min-h-ful flex-col justify-center sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-bold tracking-tight">
        Register a new account
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="py-8 px-4 border border-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)] sm:rounded-lg sm:px-10 bg-[var(--bg-color)] transition-colors"
      >
        <form class="space-y-6" @submit.prevent="handleRegister">
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
              class="inline-block w-full rounded-md border border-[var(--text-color)] px-4 py-2 font-medium shadow-[4px_4px_0_var(--text-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)] transition-all bg-transparent text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-color)]"
            >
              Register
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
</template>

<script setup lang="ts">
import { definePageMeta, useAuthStore } from "#imports";
import { reactive } from "vue";
import type { components } from "~/types/api";

definePageMeta({
  layout: "empty",
});

const registrationForm = reactive<components["schemas"]["RegisterBodyDto"]>({
  full_name: "",
  username: "",
  email: "",
  password: "",
  confirm_password: "",
});

const handleRegister = async () => {
  const { register } = useAuthStore();
  try {
    await register(registrationForm);
  } catch (error) {
    console.error("Registration failed:", error);
  }
};
</script>
