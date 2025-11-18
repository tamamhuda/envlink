<template>
  <div
    class="flex flex-col min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300"
  >
    <!-- Header -->
    <header
      class="fixed top-0 left-0 w-full z-50 bg-[var(--bg-color)] border-b border-[var(--border-color)] shadow-sm"
    >
      <div
        class="max-w-[960px] min-h-18 mx-auto flex items-center justify-between px-6 sm:px-8 py-4"
      >
        <!-- Brand -->
        <button
          class="rounded-xl bg-[var(--bg-color)] transition-all"
          @click="navigateHome"
        >
          <h1
            class="text-xl font-semibold tracking-tight text-[var(--text-color)]"
          >
            Envlink
          </h1>
        </button>

        <!-- Navigation -->
        <nav class="hidden sm:flex items-center gap-6 text-sm font-medium">
          <button
            class="hover:text-indigo-600 transition-colors"
            @click="navigateAndScroll('pricing')"
          >
            Pricing
          </button>

          <button
            :disabled="!isClientOnly"
            class="ml-4 px-4 py-2 !min-w-32 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            @click="handlePrimaryAction"
          >
            <span v-if="!hasCookie">
              <span v-if="isAuthRoute">Quick Try</span>
              <span v-else>Quick Start</span>
            </span>
            <span v-else> Dashboard </span>
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Slot for Auth Routes -->
    <NuxtPage />

    <!-- Main Home Content -->
    <main v-if="!isAuthRoute" class="flex-1 py-20 w-full">
      <!-- Welcome Section -->
      <section
        ref="welcomeRef"
        class="min-h-screen flex flex-col justify-center items-center text-center px-6"
      >
        <div class="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 class="text-5xl font-bold tracking-tight mb-4">
              Shorten Smarter with Envlink
            </h2>
            <p class="text-lg opacity-80 leading-relaxed">
              Simplify your links, track performance, and manage everything from
              one intuitive dashboard.
            </p>
          </div>

          <div
            class="mt-10 w-full py-8 px-4 sm:rounded-lg sm:px-10 border border-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)] bg-[var(--bg-color)] transition-colors"
          >
            <div class="relative group mb-4">
              <Link
                class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50 transition-opacity group-focus-within:opacity-100"
              />
              <input
                type="text"
                placeholder="Paste your long URL here"
                class="inline-flex w-full justify-center items-center border border-[var(--text-color)] font-medium shadow-[4px_4px_0_var(--text-color)] bg-transparent text-[var(--text-color)] focus:shadow-[2px_2px_0_blue] focus:outline-none focus:ring-offset-0 focus:ring-[var(--text-color)] pl-10 pr-4 py-3 rounded-lg transition-colors"
              />
            </div>
            <button
              class="w-full inline-flex items-center justify-center gap-2 rounded-lg border-l border-t border-white px-4 py-3 text-base font-semibold shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] bg-blue-700/80 text-white hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all"
            >
              Shorten URL
            </button>
          </div>

          <div
            class="mt-6 flex flex-wrap justify-center gap-3 text-sm opacity-70"
          >
            <span class="px-3 py-1 border border-[var(--text-color)] rounded-md"
              >Free to start</span
            >
            <span class="px-3 py-1 border border-[var(--text-color)] rounded-md"
              >Custom Aliases</span
            >
            <span class="px-3 py-1 border border-[var(--text-color)] rounded-md"
              >Analytics Dashboard</span
            >
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section
        id="pricing"
        ref="pricingRef"
        class="min-h-screen flex flex-col justify-center items-center px-6 text-center"
      >
        <div class="text-center mb-12 max-w-3xl mx-auto">
          <h2 class="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h2>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Choose the plan that fits your needs.
          </p>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full"
        >
          <div
            v-for="plan in plans"
            :key="plan.name"
            class="relative flex flex-col p-8 border border-[var(--text-color)] rounded-md bg-transparent text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_var(--text-color)]"
          >
            <!-- Badge -->
            <div
              v-if="plan.popular"
              class="absolute -top-4 left-1/2 transform -translate-x-1/2"
            >
              <span
                class="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm bg-[var(--text-color)] text-[var(--bg-color)]"
              >
                Most Popular
              </span>
            </div>

            <!-- Card Content -->
            <div class="flex-1">
              <!-- Plan Name -->
              <h3 class="text-xl font-semibold">
                {{ plan.name }}
              </h3>

              <!-- Description -->
              <p class="mt-2 text-sm opacity-80">
                {{ plan.description }}
              </p>

              <!-- Price -->
              <div class="mt-6 mb-8">
                <div class="flex items-baseline justify-center">
                  <span class="text-4xl font-bold tracking-tight">
                    {{ plan.price }}
                  </span>
                  <span
                    v-if="plan.price !== 'Free' && plan.name !== 'Enterprise'"
                    class="ml-2 text-sm opacity-70"
                  >
                    /month
                  </span>
                </div>
              </div>

              <!-- Features -->
              <ul class="space-y-3 mb-8 text-left">
                <li
                  v-for="(feature, index) in plan.features"
                  :key="index"
                  class="flex items-start"
                >
                  <Check
                    class="flex-shrink-0 w-5 h-5 text-[var(--text-color)] mt-0.5"
                  />
                  <span class="ml-3 text-sm">
                    {{ feature }}
                  </span>
                </li>
              </ul>
            </div>

            <!-- CTA Button -->
            <div class="pt-0">
              <button
                class="w-full inline-flex items-center justify-center gap-2 rounded-lg border-l border-t border-white px-4 py-3 text-base font-semibold shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none hover:translate-x-[2px] hover:translate-y-[2px]"
                :class="[
                  plan.popular
                    ? 'bg-blue-700/80 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
                ]"
                @click="handlePrimaryAction"
              >
                {{ plan.cta }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer
      class="border-t border-[var(--border-color)] text-center py-6 text-sm mt-auto max-w-[960px] mx-auto w-full text-gray-600 dark:text-gray-400"
    >
      © {{ year }} Envlink. All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
  nextTick,
  useRouter,
  useRoute,
  navigateTo,
  useAuthStore,
  useUserApi,
} from "#imports";
import { Check, Link } from "lucide-vue-next";

const plans = ref([
  {
    name: "Free",
    description: "Essential link shortening tools.",
    price: "Free",
    features: ["Short Links", "Custom Aliases", "Basic Analytics"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Starter",
    description: "Grow your personal or small project.",
    price: "$7.5",
    features: [
      "All Free features",
      "Batch Links (up to 100)",
      "QR Codes",
      "Simple Geo Targeting",
    ],
    cta: "Start Now",
    popular: false,
  },
  {
    name: "Pro",
    description: "For teams and marketing professionals.",
    price: "$22.5",
    features: [
      "All Starter features",
      "Advanced Analytics",
      "Device Targeting",
      "Metadata Fetching",
    ],
    cta: "Get Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "Full control and scalability with API access.",
    price: "Contact us",
    features: [
      "All Pro features",
      "Unlimited Batch Links",
      "Dedicated API Key",
      "Priority Support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]);

const authStore = useAuthStore();
// const { fetchUser } = await authStore.useFetchUser();
const { getUserInfo } = useUserApi().getInfo();
const router = useRouter();
const route = useRoute();
const hasCookie = computed(() => authStore.hasCookie());

const year = new Date().getFullYear();
const isClientOnly = ref(false);
const isAuthenticcated = computed(() => authStore.isAuthenticated);

// Refs for scroll targets
const pricingRef = ref<HTMLElement | null>(null);

// Detect client
onMounted(() => {
  if (import.meta.client) isClientOnly.value = true;
});

// Track current route (for auth routes)
const isAuthRoute = ref(false);
watch(
  () => router.currentRoute.value.path,
  (path) => {
    isAuthRoute.value = ["/login", "/register", "/verify"].includes(path);
  },
  { immediate: true },
);

// Navigation helpers
const navigateHome = async () => {
  if (router.currentRoute.value.path === "/") {
    // Already on home, scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.replace({ path: "/" });
  } else {
    // Navigate to home page
    await navigateTo("/");
  }
};

// Use query param scroll
const navigateAndScroll = async (section: string) => {
  if (router.currentRoute.value.path !== "/") {
    await navigateTo("/");
    setTimeout(() => {
      navigateTo({ path: "/", query: { scroll: section } });
    }, 300);
  } else {
    scrollToSection(section);
  }
};

// Scroll handler
const scrollToSection = async (section: string) => {
  await nextTick();
  const refsMap = { pricing: pricingRef };
  const target = refsMap[section as keyof typeof refsMap]?.value;
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// Handle scroll query param
onMounted(() => {
  const scrollTarget = route.query.scroll as string;
  if (scrollTarget) scrollToSection(scrollTarget);
});

// Optional: clean URL after scroll
watch(
  () => route.query.scroll,
  async (val) => {
    if (val) {
      await scrollToSection(val as string);
      // router.replace({ query: {} });
    }
  },
);

watch(hasCookie, async () => {
  if (isClientOnly.value) {
    await getUserInfo();
  }
});

// Primary button logic
const handlePrimaryAction = async () => {
  if (isAuthenticcated.value) {
    await navigateTo("/dashboard");
  } else if (isAuthRoute.value) {
    await navigateTo("/");
  } else {
    await navigateTo("/register");
  }
};
</script>
