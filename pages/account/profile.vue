<template>
  <div
    class="flex w-full min-h-full flex-col text-[var(--text-color)] transition-colors duration-300"
  >
    <main class="min-h-full w-full flex flex-1 max-w-7xl py-6 sm:px-6 lg:px-8">
      <div
        v-if="ready && user"
        class="w-full max-h-fit rounded-lg border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-color)] p-6 shadow-sm transition-colors"
      >
        <h3 class="text-lg font-medium leading-6">Update Profile</h3>

        <form class="mt-6 space-y-6" @submit.prevent="updateProfile">
          <div
            v-if="errorMessage"
            class="rounded-md bg-red-50 p-4 border border-red-200"
          >
            <p class="text-sm font-medium text-center text-red-800">
              {{ errorMessage }}
            </p>
          </div>
          <div
            v-if="successMessage"
            class="rounded-md bg-green-50 p-4 border border-green-200"
          >
            <p class="text-sm font-medium text-center text-green-800">
              {{ successMessage }}
            </p>
          </div>
          <FormInput
            id="full_name"
            :model-value="userForm.full_name ?? ''"
            label="Full Name"
            type="text"
            required
          />

          <FormInput
            id="username"
            :model-value="userForm.username ?? ''"
            label="Username"
            type="text"
            required
          />

          <FormInput
            id="email"
            :model-value="userForm.email ?? ''"
            label="Email address"
            type="email"
            required
          />

          <FormInput
            id="phone_number"
            :model-value="userForm.phone_number ?? ''"
            label="Phone Number"
            type="text"
          />

          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
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
              {{ isLoading ? "Updating..." : "Update Profile" }}
            </button>
          </div>
        </form>
      </div>

      <div v-else class="flex justify-center items-center w-full">
        <Loading />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useNuxtApp } from "#app";
import { onMounted, ref, reactive, watch } from "vue";
import { definePageMeta, useAuthStore } from "#imports";
import type { components } from "~/types/api";

const authStore = useAuthStore();
const api = useNuxtApp().$api;

const userForm = reactive<components["schemas"]["UpdateUserBodyDto"]>({
  full_name: "",
  username: "",
  email: "",
  phone_number: null,
  avatar: null,
});

const ready = ref(false);
const user = ref(authStore.user);
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// SSR + Client-safe user loading
if (import.meta.server) {
  // SSR-side prefetch if user not yet available
  if (!authStore.user) {
    await authStore.fetchUser?.();
  }
  user.value = authStore.user;
  ready.value = true;
} else {
  // Client hydration phase
  onMounted(async () => {
    if (!authStore.user) {
      await authStore.fetchUser?.();
    }
    user.value = authStore.user;
    ready.value = true;
  });
}

// Populate form when user data becomes available
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      Object.assign(userForm, {
        full_name: newUser.full_name,
        username: newUser.username,
        email: newUser.email,
        phone_number: newUser.phone_number,
        avatar: newUser.avatar,
      });
    }
  },
  { immediate: true },
);

const updateProfile = async () => {
  if (!authStore.user?.id) return;

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await api<components["schemas"]["UserInfoResponse"]>(
      `/api/v1/user/update/${authStore.user.id}`,
      {
        method: "PUT",
        body: userForm,
      },
    );
    if (response) {
      authStore.setUser(response.data);
      successMessage.value = "Profile updated successfully!";
    }
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

definePageMeta({
  layout: "authenticated",
});
</script>
