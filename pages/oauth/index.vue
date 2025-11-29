<script setup lang="ts">
import {
  computed,
  definePageMeta,
  navigateTo,
  onMounted,
  useOauthApi,
  useRoute,
  useRouter,
} from "#imports";

const route = useRoute();
const router = useRouter();
const query = computed(() => route.query || {});
const oauth = useOauthApi();
const { exchangeCode, error: exchangeCodeError } = oauth.exchangeCode();
const { signInWithGoogleCredential, error: signInWithGoogleCredentialError } =
  oauth.googleCredential();

const handleExchangeCode = async (code: string, from: string) => {
  await exchangeCode(code);
  if (exchangeCodeError.value) {
    navigateTo({
      path: `/${from}`,
      query: {
        error: "Invalid Authorization",
      },
    });
    return;
  }
  return;
};

const handleSignInWithGoogleCredential = async (
  from: string,
  credential: string,
) => {
  await signInWithGoogleCredential(credential);
  if (signInWithGoogleCredentialError.value) {
    navigateTo({
      path: `/${from}`,
      query: {
        error: "Invalid Authorization",
      },
    });
    return;
  }
  return;
};

onMounted(async () => {
  const code = String(query.value["?code"] || "") || undefined;
  const from = String(query.value["from"] || "") || undefined;
  const credential = String(query.value["credential"] || "") || undefined;

  if (from && code) {
    await handleExchangeCode(code, from);
  }
  if (from && credential) {
    await handleSignInWithGoogleCredential(from, credential);
  }
  navigateTo("/login");
});
definePageMeta({
  layout: "empty",
});
</script>
<template>
  <main
    class="relative flex flex-1 items-center flex-col justify-center h-full py-6 sm:px-4 lg:px-8"
  >
    <Loader mode="dark" />
    <span class="text-lg font-bold text-center">Redirecting...</span>
  </main>
</template>
