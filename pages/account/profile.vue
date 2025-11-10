<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { definePageMeta, useAuthStore, useUserApi } from "#imports";
import type { UpdateUserRequest } from "~/interfaces/api.interface";

const isReady = ref(false);
const auth = useAuthStore();
const userApi = useUserApi();
const { fetchUser } = await userApi.useFetchUser();

const userForm = reactive<UpdateUserRequest>({
  full_name: "",
  username: "",
  phone_number: "",
  email: "",
});

const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const isLoading = ref(false);

onMounted(async () => {
  isReady.value = true;
  if (!auth.user) await fetchUser?.();
});

watch(
  () => auth.user,
  (u) => {
    if (u) Object.assign(userForm, u);
  },
  { immediate: true },
);
// simpler computed to detect changes
const normalize = (v?: string | null) => (v ?? "").trim();

const isFormChanged = computed(() => {
  const u = auth.user;
  if (!u) return false;

  return (
    normalize(userForm.full_name) !== normalize(u.full_name) ||
    normalize(userForm.username) !== normalize(u.username) ||
    normalize(userForm.phone_number) !== normalize(u.phone_number)
  );
});

const updateProfile = async () => {
  if (!auth.user?.id || !isFormChanged.value) return;

  isLoading.value = true;
  successMessage.value = null;
  errorMessage.value = null;

  const { fetchUpdateUser, error } = await userApi.useFetchUpdateUser({
    ...userForm,
  });
  await fetchUpdateUser();

  if (!error.value) {
    successMessage.value = "Profile updated successfully";
  } else {
    errorMessage.value = error.value.data?.message || "An error occurred";
  }
  isLoading.value = false;
};

definePageMeta({ layout: "account" });
</script>

<template>
  <Content :is-ready="isReady && Boolean(auth.user)">
    <div
      class="rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
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
          v-model="userForm.full_name"
          label="Full Name"
          type="text"
          required
        />
        <FormInput
          id="username"
          v-model="userForm.username"
          label="Username"
          type="text"
          required
        />
        <FormInput
          id="email"
          v-model="userForm.email"
          label="Email address"
          type="email"
          disabled
        />
        <FormInput
          id="phone_number"
          v-model="userForm.phone_number"
          label="Phone Number"
          type="text"
        />

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormChanged"
            class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 dark:bg-blue-700/80 text-white shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none hover:translate-x-[2px] hover:translate-y-[2px]"
            :class="{
              'opacity-50 cursor-not-allowed': isLoading || !isFormChanged,
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
            {{ isLoading ? "Updating..." : "Update Profile" }}
          </button>
        </div>
      </form>
    </div>
  </Content>
</template>
