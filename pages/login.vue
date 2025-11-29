<template>
  <main
    class="text-center h-full items-center justify-center w-full flex flex-1 my-14"
  >
    <div
      class="flex w-full min-h-full flex-col items-center justify-center py-12 sm:px-6 lg:px-8 bg-(--bg-color) text-(--text-color) transition-colors"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="box-shadow-card p-4 sm:p-8">
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
              :icon="User"
              required
              autocomplete="username"
            />

            <FormInput
              id="password"
              v-model="credentials.password"
              label="Password"
              type="password"
              :icon="Lock"
              required
              autocomplete="password"
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
                {{ isLoading ? "Signing in..." : "Sign in" }}
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
                  class="bg-(--bg-color) px-2 text-(--text-color) opacity-70 transition-colors"
                >
                  Or continue with
                </span>
              </div>
            </div>

            <div class="mt-6">
              <button
                class="inline-flex w-full justify-center items-center rounded-md border bg-(--shadow-color)/20 dark:bg-gray-500/10 border-(--border-color) px-4 py-2 font-medium shadow-[4px_4px_0_var(--primary-color)] dark:shadow-[4px_4px_0_var(--shadow-color)] transition-all text-(--text-color) focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-(--primary-color)"
                :class="{
                  'opacity-50 cursor-not-allowed': isSignInWithGooglePending,
                  '': !isSignInWithGooglePending,
                }"
                type="button"
                :disabled="isSignInWithGooglePending"
                @click="handleGoogleSignIn"
              >
                <svg
                  v-if="isSignInWithGooglePending"
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
                  isSignInWithGooglePending
                    ? "Signing in..."
                    : "Sign in with Google"
                }}
              </button>
            </div>

            <div class="mt-6">
              <NuxtLink
                to="/register"
                class="block text-center font-medium text-(--text-color) opacity-80 hover:opacity-100 transition-colors"
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
import { onMounted, reactive, ref } from "vue";
import { User, Lock } from "lucide-vue-next";
import {
  computed,
  definePageMeta,
  useAuthApi,
  useHead,
  useOauthApi,
  useRoute,
  useRouter,
} from "#imports";
import {
  instanceOfErrorResponse,
  type LoginRequest,
} from "~/client/src/generated";

definePageMeta({
  layout: "main",
});

const route = useRoute();
const router = useRouter();
const queryError = computed(() => String(route.query.error || "") || undefined);
const auth = useAuthApi();
const oauth = useOauthApi();
const { signInWithGoogle } = oauth.googleSignIn();

const errorMessage = ref<string | null>(null);
const isSignInWithGooglePending = ref(false);

const credentials = reactive<LoginRequest>({
  username: "",
  password: "",
});

const { error, login, pending: isLoading } = auth.login();

const handleLogin = async () => {
  await login(credentials);

  if (error.value) {
    if (instanceOfErrorResponse(error.value)) {
      errorMessage.value = error.value.message || "An error occurred";
      return;
    }
    errorMessage.value = "An error occurred";
  }
};

onMounted(() => {
  if (queryError.value) {
    errorMessage.value = queryError.value;
    router.replace({ path: "/login" });
  }
});

const handleGoogleSignIn = async () => {
  isSignInWithGooglePending.value = true;
  const result = await signInWithGoogle("/oauth?from=login&");
  if (result) {
    window.location.href = result.url;
  }
  setTimeout(() => {
    isSignInWithGooglePending.value = false;
  }, 1000);
};
</script>
