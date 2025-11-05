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
          <FormInput
            id="full_name"
            label="Full Name"
            type="text"
            :model-value="userForm.full_name ?? ''"
            required
          />

          <FormInput
            id="username"
            label="Username"
            type="text"
            :model-value="userForm.username ?? ''"
            required
          />

          <FormInput
            id="email"
            label="Email address"
            type="email"
            :model-value="userForm.email ?? ''"
            required
          />

          <FormInput
            id="phone_number"
            label="Phone Number"
            type="text"
            :model-value="userForm.phone_number ?? ''"
          />

          <div>
            <button
              type="submit"
              class="flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Profile
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
import { useAuthStore } from "#imports";
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

  try {
    const response = await api<components["schemas"]["UserInfoResponse"]>(
      `/api/v1/user/update/${authStore.user.id}`,
      {
        method: "PUT",
        body: userForm,
      },
    );
    if (response.data) {
      authStore.setUser(response.data);
      // Optional: success toast or feedback
    }
  } catch (error) {
    console.error("Profile update failed:", error);
  }
};
</script>
