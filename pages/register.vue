<template>
  <main
    class="text-center h-full items-center justify-center w-full flex flex-1 my-14"
  >
    <div
      class="flex w-full flex-col sm:flex-row items-center justify-center bg-(--bg-color) text-(--text-color) transition-colors"
    >
      <!-- Left Info Section -->
      <div
        class="hidden sm:flex flex-1 flex-col items-center justify-center px-8 lg:px-16 border-r border-(--border-color)"
      >
        <div class="max-w-md text-center">
          <h1 class="text-4xl font-bold mb-4 tracking-tight">
            Welcome to Envlink
          </h1>
          <p class="text-base opacity-80 mb-8">
            Create an account to shorten, track, and manage your links with
            ease. Our platform helps you organize and optimize your link
            performance.
          </p>
          <ul class="space-y-3 text-left inline-block text-sm opacity-90">
            <li>• Real-time analytics for your shortened links</li>
            <li>• Custom aliases and branded domains</li>
            <li>• Secure and scalable API for developers</li>
          </ul>
        </div>
      </div>

      <!-- Right Form Section -->
      <div
        class="flex flex-1 items-center justify-center py-12 sm:px-6 lg:px-8"
      >
        <div class="w-full max-w-md space-y-8">
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="text-center text-3xl font-bold tracking-tight">
              Register a new account
            </h2>
          </div>

          <div class="box-shadow-card p-4 sm:p-8">
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
                id="fullName"
                v-model="registrationForm.fullName"
                label="Full Name"
                type="text"
                :icon="User"
                required
              />

              <FormInput
                id="username"
                v-model="registrationForm.username"
                label="Username"
                type="text"
                :icon="AtSign"
                required
                autocomplete="username"
              />

              <FormInput
                id="email"
                v-model="registrationForm.email"
                label="Email address"
                type="email"
                :icon="Mail"
                required
              />

              <FormInput
                id="password"
                v-model="registrationForm.password"
                label="Password"
                type="password"
                :icon="Lock"
                required
                autocomplete="current-password"
              />

              <FormInput
                id="confirmPassword"
                v-model="registrationForm.confirmPassword"
                label="Confirm Password"
                type="password"
                :icon="Lock"
                required
                autocomplete="confirm-password"
              />

              <div>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="inline-flex w-full justify-center items-center rounded-md border border-(--border-color) px-4 py-2 font-medium shadow-[4px_4px_0_var(--shadow-color)] transition-all bg-(--primary-color) text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--primary-color)"
                  :class="{
                    'opacity-50 cursor-not-allowed': isLoading,
                    'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--shadow-color)]':
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
                  <div class="w-full border-t border-(--border-color)" />
                </div>
                <div class="relative flex justify-center text-sm">
                  <span
                    class="bg-(--bg-color) px-2 text-(--text-color) opacity-70"
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              <div class="mt-6">
                <button
                  class="inline-flex w-full justify-center items-center rounded-md border bg-(--shadow-color)/20 dark:bg-gray-500/10 border-(--border-color) px-4 py-2 font-medium shadow-[4px_4px_0_var(--primary-color)] dark:shadow-[4px_4px_0_var(--shadow-color)] transition-all text-(--text-color) focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--primary-color)"
                  :class="{
                    'opacity-50 cursor-not-allowed': isSignUpWithGooglePending,
                    'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--primary-color)] dark:hover:shadow-[2px_2px_0_var(--shadow-color)]':
                      !isSignUpWithGooglePending,
                  }"
                  type="button"
                  :disabled="isSignUpWithGooglePending"
                  @click="handleGoogleSignIn"
                >
                  <svg
                    v-if="isSignUpWithGooglePending"
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
                  <img
                    v-else
                    src="/icons/google.png"
                    alt="Google logo"
                    class="h-5 w-5 mr-2"
                  />
                  {{
                    isSignUpWithGooglePending
                      ? "Signing up..."
                      : "Sign up with Google"
                  }}
                </button>
              </div>

              <div class="mt-6">
                <NuxtLink
                  to="/login"
                  class="block text-center font-medium text-(--text-color) opacity-80 hover:opacity-100 transition-opacity"
                >
                  Already have an account? Sign in here.
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  definePageMeta,
  useAuthApi,
  useOauthApi,
  useRoute,
  useRouter,
  computed,
} from "#imports";
import { reactive, ref, onMounted } from "vue";
import { User, AtSign, Mail, Lock } from "lucide-vue-next";
import {
  instanceOfErrorResponse,
  type RegisterRequest,
} from "~/client/src/generated";

const auth = useAuthApi();
const oauth = useOauthApi();
const route = useRoute();
const router = useRouter();

const queryError = computed(() => String(route.query.error || "") || undefined);
const { signInWithGoogle } = oauth.googleSignIn();
const errorMessage = ref<string | null>(null);
const isSignUpWithGooglePending = ref(false);

const registrationForm = reactive<RegisterRequest>({
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const { register, pending: isLoading, error } = auth.register();

const handleRegister = async () => {
  errorMessage.value = null;
  if (registrationForm.password !== registrationForm.confirmPassword) {
    errorMessage.value = "Passwords do not match";
    return;
  }
  await register(registrationForm);
  if (error.value && instanceOfErrorResponse(error.value)) {
    errorMessage.value = error.value.message || "An error occurred";
  }
};

onMounted(() => {
  if (queryError.value) {
    errorMessage.value = queryError.value;
    router.replace({ path: "/register" });
  }
});

const handleGoogleSignIn = async () => {
  isSignUpWithGooglePending.value = true;
  const result = await signInWithGoogle("/oauth?from=register&");
  if (result) {
    window.location.href = result.url;
  }
  setTimeout(() => {
    isSignUpWithGooglePending.value = false;
  }, 1000);
};

definePageMeta({
  layout: "main",
});
</script>
