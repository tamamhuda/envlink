<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { definePageMeta, useAuthStore, useUserApi } from "#imports";
import { Camera } from "lucide-vue-next";
import { isEqual } from "lodash";
import {
  instanceOfErrorResponse,
  type UpdateUserRequest,
} from "~/client/src/generated";

const isReady = ref(false);
const auth = useAuthStore();
const user = useUserApi();
const { getUserInfo } = user.getInfo();
const {
  uploadUserAvatar,
  error: errorUploadAvatar,
  pending: loadingUploadAvatar,
} = user.uploadAvatar();

const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const avatarPreview = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const avatarError = ref<string | null>(null);
const avatarDisplayUrl = computed(() => {
  return avatarPreview.value || auth.user?.avatar || null;
});

const userForm = reactive<UpdateUserRequest>({
  fullName: "",
  username: "",
  phoneNumber: "",
  email: "",
});

const userInitials = computed(() => {
  const fullName = auth.user?.fullName;
  if (!fullName) return "";
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
});

const triggerFileInput = () => {
  if (loadingUploadAvatar.value) return;
  fileInput.value?.click();
};

const onFileChange = async (event: Event) => {
  avatarError.value = null;
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];

    if (file.size > 1 * 1024 * 1024) {
      // 1MB
      avatarError.value = "File size must be less than 1MB.";
      if (fileInput.value) fileInput.value.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    await uploadUserAvatar(file);

    if (
      errorUploadAvatar.value &&
      instanceOfErrorResponse(errorUploadAvatar.value)
    ) {
      avatarPreview.value = null;
      avatarError.value =
        errorUploadAvatar.value.message || "Failed to upload avatar.";
    } else {
      avatarPreview.value = null;
    }
    if (fileInput.value) fileInput.value.value = "";
  }
};

onMounted(async () => {
  if (import.meta.client) {
    isReady.value = true;
  }
  if (!auth.user) await getUserInfo?.();
});

watch(
  () => auth.user,
  (u) => {
    if (u) Object.assign(userForm, u);
  },
  { immediate: true }
);

const isFormChanged = computed(() => {
  const u = auth.user;
  if (!u) return false;

  // Pick only the relevant fields for comparison
  const original = {
    fullName: u.fullName ?? "",
    username: u.username ?? "",
    phoneNumber: u.phoneNumber ?? "",
  };

  const current = {
    fullName: userForm.fullName?.trim(),
    username: userForm.username?.trim(),
    phoneNumber: userForm.phoneNumber?.trim() ?? "",
  };

  return !isEqual(original, current);
});

const { error, pending: isLoading, updateUser, response } = user.update();

const updateProfile = async () => {
  successMessage.value = null;
  errorMessage.value = null;

  const updateUserRequest = {
    fullName: userForm.fullName?.trim(),
    username: userForm.username?.trim(),
    phoneNumber: userForm.phoneNumber?.trim() ?? "",
  };

  await updateUser(updateUserRequest);

  if (error.value) {
    errorMessage.value = error.value.message || "An error occurred";
  }

  if (response.value) {
    successMessage.value = "Profile updated successfully";
  }
};

definePageMeta({ layout: "account" });
</script>

<template>
  <Content :is-ready="isReady && Boolean(auth.user)">
    <div class="box-inner-card p-4 sm:p-8">
      <!-- Avatar Section -->
      <div class="flex flex-col items-center">
        <h3 class="text-lg font-medium leading-6">Profile Picture</h3>
        <div class="mt-6 relative">
          <div
            v-if="avatarDisplayUrl"
            class="w-32 h-32 rounded-full overflow-hidden"
          >
            <img
              :src="avatarDisplayUrl"
              alt="Avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
          >
            <span class="text-4xl font-semibold text-gray-500">{{
              userInitials
            }}</span>
          </div>
          <div
            v-if="loadingUploadAvatar"
            class="absolute inset-0 w-32 h-32 rounded-full bg-black bg-opacity-50 flex items-center justify-center"
          >
            <svg
              class="animate-spin h-10 w-10 text-white"
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
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <button
            class="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-2 border-2 border-[--text-color] shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            :disabled="loadingUploadAvatar"
            :class="{ 'cursor-not-allowed opacity-50': loadingUploadAvatar }"
            @click="triggerFileInput"
          >
            <Camera class="w-5 h-5 text-[--text-color]" />
          </button>
        </div>
        <input
          ref="fileInput"
          class="hidden"
          accept="image/*"
          type="file"
          @change="onFileChange"
        />
        <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
          JPG, GIF or PNG. 1MB max.
        </p>
        <p v-if="avatarError" class="mt-2 text-sm text-red-500">
          {{ avatarError }}
        </p>
      </div>

      <hr class="my-8 border-dashed border-gray-300 dark:border-gray-600" />

      <!-- Form Section -->
      <div>
        <h3 class="text-lg font-medium leading-6">Account Details</h3>
        <form class="mt-6" @submit.prevent="updateProfile">
          <div
            v-if="errorMessage"
            class="rounded-md bg-red-50 p-4 border border-red-200 mb-6"
          >
            <p class="text-sm font-medium text-center text-red-800">
              {{ errorMessage }}
            </p>
          </div>

          <div
            v-if="successMessage"
            class="rounded-md bg-green-50 p-4 border border-green-200 mb-6"
          >
            <p class="text-sm font-medium text-center text-green-800">
              {{ successMessage }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <FormInput
              id="full_name"
              v-model="userForm.fullName"
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
              v-model="userForm.phoneNumber"
              label="Phone Number"
              type="text"
            />
          </div>

          <div class="mt-8">
            <button
              type="submit"
              :disabled="isLoading || !isFormChanged"
              class="button-box"
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
    </div>
  </Content>
</template>
