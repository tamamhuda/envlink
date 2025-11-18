<script setup lang="ts">
import { definePageMeta, ref, reactive } from "#imports";
import Content from "~/components/Content.vue";
import FormInput from "~/components/FormInput.vue";
import { Loader2 } from "lucide-vue-next";

definePageMeta({ layout: "account" });

const passwords = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const isLoading = ref(false);
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const handleChangePassword = async () => {
  errorMessage.value = null;
  successMessage.value = null;

  if (passwords.newPassword !== passwords.confirmPassword) {
    errorMessage.value = "New password and confirmation do not match.";
    return;
  }

  if (passwords.newPassword.length < 8) {
    errorMessage.value = "New password must be at least 8 characters long.";
    return;
  }

  isLoading.value = true;

  // This is a mock API call. Replace with your actual API call.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Example of how you might call your API:
  //
  // const { error } = await useAuthApi().useChangePassword({
  //   old_password: passwords.oldPassword,
  //   new_password: passwords.newPassword,
  // });
  //
  // if (error.value) {
  //   errorMessage.value = error.value.data?.message || "Failed to change password.";
  // } else {
  //   successMessage.value = "Password changed successfully.";
  //   passwords.oldPassword = "";
  //   passwords.newPassword = "";
  //   passwords.confirmPassword = "";
  // }

  // Mocking success/error for demonstration
  if (passwords.oldPassword === "password") {
    successMessage.value = "Password changed successfully!";
    passwords.oldPassword = "";
    passwords.newPassword = "";
    passwords.confirmPassword = "";
  } else {
    errorMessage.value = "Incorrect old password.";
  }

  isLoading.value = false;
};
</script>

<template>
  <Content :is-ready="true">
    <div
      class="rounded-xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_grey] transition-all"
    >
      <h3 class="text-lg font-semibold leading-6 mb-6">Change Password</h3>

      <form @submit.prevent="handleChangePassword" class="space-y-6 max-w-md">
        <div
          v-if="errorMessage"
          class="text-red-500 text-sm text-center p-3 bg-red-500/10 rounded-lg"
        >
          {{ errorMessage }}
        </div>
        <div
          v-if="successMessage"
          class="text-green-500 text-sm text-center p-3 bg-green-500/10 rounded-lg"
        >
          {{ successMessage }}
        </div>

        <FormInput
          id="old_password"
          v-model="passwords.oldPassword"
          label="Old Password"
          type="password"
          required
        />
        <FormInput
          id="new_password"
          v-model="passwords.newPassword"
          label="New Password"
          type="password"
          required
        />
        <FormInput
          id="confirm_password"
          v-model="passwords.confirmPassword"
          label="Confirm New Password"
          type="password"
          required
        />

        <div class="flex justify-end pt-2">
          <button
            type="submit"
            :disabled="isLoading"
            class="inline-flex items-center justify-center gap-2 rounded-lg border-l border-t border-white px-4 py-3 bg-blue-700/80 text-white text-base font-semibold shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
            <span>{{ isLoading ? "Saving..." : "Save Changes" }}</span>
          </button>
        </div>
      </form>
    </div>
  </Content>
</template>
