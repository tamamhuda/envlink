<template>
  <div
    class="flex flex-col min-h-screen bg-(--bg-color) text-(--text-color) transition-colors"
  >
    <!-- Header -->
    <header
      class="fixed top-0 left-0 w-full z-50 bg-(--bg-color) border-b border-(--border-color) shadow-sm"
    >
      <div
        class="max-w-screen-2xl min-h-[75px] mx-auto flex items-center justify-between px-6 sm:px-8 py-4"
      >
        <!-- Brand -->
        <button
          class="rounded-xl transition-all flex items-center gap-2"
          @click="navigateHome"
        >
          <div>
            <img
              src="/icons/envlink-light.svg"
              alt="Envlink Logo"
              class="h-10 block dark:hidden"
            />
            <img
              src="/icons/envlink-dark.svg"
              alt="Envlink Logo"
              class="h-10 hidden dark:block"
            />
          </div>
          <h1 class="text-xl font-semibold tracking-tight text-(--text-color)">
            Envlink
          </h1>
        </button>

        <!-- Navigation -->
        <nav class="hidden sm:flex items-center gap-6 text-sm font-medium">
          <!-- Theme Toggle -->
          <button
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            aria-label="Toggle Theme"
            @click="toggleTheme"
          >
            <div class="relative w-5 h-5">
              <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform rotate-90 opacity-0 scale-50"
                enter-to-class="transform rotate-0 opacity-100 scale-100"
                leave-active-class="transition duration-300 ease-in"
                leave-from-class="transform rotate-0 opacity-100 scale-100"
                leave-to-class="transform -rotate-90 opacity-0 scale-50"
              >
                <Sun
                  v-if="!isDarkMode"
                  class="w-5 h-5 absolute inset-0 text-orange-500"
                />
                <Moon v-else class="w-5 h-5 absolute inset-0 text-blue-400" />
              </Transition>
            </div>
          </button>
          <button
            class="hover:text-indigo-600 transition-colors"
            @click="navigateAndScroll('pricing')"
          >
            Pricing
          </button>

          <button
            :disabled="!isClientOnly"
            class="ml-4 px-4 py-2 min-w-32! bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
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

          <div class="box-inner-card p-8">
            <div class="relative group mb-4">
              <Link
                class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50 transition-opacity group-focus-within:opacity-100"
              />
              <input
                type="text"
                placeholder="Paste your long URL here"
                class="inline-flex w-full justify-center items-center border border-(--border-color) font-medium shadow-[4px_4px_0_var(--shadow-color)] bg-transparent text-(--text-color) focus:shadow-[2px_2px_0_var(--primary-color)] focus:outline-none focus:ring-offset-0 focus:ring-(--text-color) pl-10 pr-4 py-3 rounded-lg transition-colors"
              />
            </div>
            <button
              class="button-box w-full min-h-12 flex items-center justify-center"
            >
              Shorten URL
            </button>
          </div>

          <div
            class="mt-6 flex flex-wrap justify-center gap-3 text-sm opacity-70"
          >
            <span class="px-3 py-1 border border-(--text-color) rounded-md"
              >Free to start</span
            >
            <span class="px-3 py-1 border border-(--text-color) rounded-md"
              >Custom Aliases</span
            >
            <span class="px-3 py-1 border border-(--text-color) rounded-md"
              >Analytics Dashboard</span
            >
          </div>
        </div>
      </section>

      <!-- Pricing Section -->
      <section
        id="pricing"
        ref="pricingRef"
        class="min-h-[calc(100vh-20rem)] my-auto flex flex-col justify-center items-center px-6 text-center"
      >
        <div class="text-center mb-12 max-w-3xl mx-auto">
          <h2 class="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h2>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Choose the plan that fits your needs.
          </p>
        </div>

        <Content :is-ready="isClientOnly && plans.length > 0">
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full"
          >
            <div
              v-for="plan in plans"
              :key="plan.name"
              class="box-shadow-card p-8 relative flex flex-col transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_var(--shadow-color)]"
            >
              <!-- Badge -->
              <div
                v-if="plan.badge"
                class="absolute -top-4 left-1/2 transform -translate-x-1/2"
              >
                <span
                  class="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm bg-(--primary-color) text-white"
                >
                  {{ plan.badge }}
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
                      {{ plan.priceLabel }}
                    </span>
                    <span
                      v-if="
                        plan.priceLabel !== 'Free' && plan.name !== 'Enterprise'
                      "
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
                      class="shrink-0 w-5 h-5 text-(--text-color) mt-0.5"
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
                  :class="[
                    plan.popular || plan.name === 'Enterprise'
                      ? 'button-box'
                      : 'button-box verbose text-gray-800 dark:text-gray-200',
                  ]"
                  @click="handlePrimaryAction"
                >
                  {{ plan.cta }}
                </button>
              </div>
            </div>
          </div>
        </Content>
      </section>
    </main>

    <!-- Footer -->
    <footer
      class="border-t border-(--border-color) text-center py-6 text-sm mt-auto max-w-[960px] mx-auto w-full text-gray-600 dark:text-gray-400"
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
  useRuntimeConfig,
  onUnmounted,
  useSubscriptionStore,
  useTheme,
} from "#imports";
import { Check, Link, Sun, Moon } from "lucide-vue-next";

const authStore = useAuthStore();
const subscriptionsStore = useSubscriptionStore();
const { getUserInfo } = useUserApi().getInfo();
const router = useRouter();
const route = useRoute();
const GOOGLE_CLIENT_ID = useRuntimeConfig().public.google.clientId;
const hasCookie = computed(() => authStore.hasCookie());

const year = new Date().getFullYear();
const isClientOnly = ref(false);
const isAuthenticcated = computed(() => authStore.isAuthenticated);
const plans = computed(() => subscriptionsStore.plans);

// Theme State
const { isDarkMode, toggleTheme } = useTheme();

// Refs for scroll targets
const pricingRef = ref<HTMLElement | null>(null);
let promptInterval: NodeJS.Timeout | null = null;
const isReady = ref(false);

function handleGoogleLogin(response: any) {
  if (isAuthenticcated.value) return;
  const { credential } = response; // Google ID Token (JWT)

  // Send to backend
  navigateTo({
    path: "/oauth",
    query: {
      credential: credential,
      from: "login",
    },
  });
}

// Detect client
const initializeGoogle = () => {
  const google = (window as any).google;
  if (!google) return;

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleLogin,
    // Optional: prevent closing on click outside to ensure explicit action
    cancel_on_tap_outside: false,
  });

  // Prompt One Tap with logging
  if (!isAuthenticcated.value) {
    google.accounts.id.prompt();
  }

  // Render button if element exists
  const btn = document.getElementById("google-login-btn");
  if (btn) {
    google.accounts.id.renderButton(document.getElementById("gsi-container"), {
      theme: "outline",
      size: "large",
    });
  }
};

onMounted(async () => {
  if (import.meta.client) {
    isReady.value = true;
    // Dark mode initialization

    isClientOnly.value = true;
    // Check and reset g_state cookie if needed
    const checkAndResetGState = () => {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      };

      const deleteCookie = (name: string) => {
        document.cookie =
          name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      };

      const gState = getCookie("g_state");
      const resetSchedule = localStorage.getItem("g_reset_schedule");

      if (gState) {
        if (!resetSchedule) {
          // Schedule a reset in 1 hour (using 10s for testing visibility)
          const resetTime = Date.now() + 10000;
          localStorage.setItem("g_reset_schedule", resetTime.toString());
        } else {
          if (Date.now() > parseInt(resetSchedule)) {
            // Time to reset
            deleteCookie("g_state");
            localStorage.removeItem("g_reset_schedule");
          }
        }
      }
    };

    checkAndResetGState();

    if ((window as any).google) {
      initializeGoogle();
    }

    // Setup interval to show prompt
    promptInterval = setInterval(() => {
      // If google is loaded but not initialized (e.g. script loaded late), initialize it
      if (
        (window as any).google &&
        !(window as any).google.accounts.id.intermediate
      ) {
        // Note: .intermediate is an internal property, but re-initializing is safe
        initializeGoogle();
      }

      if (!isAuthenticcated.value && (window as any).google) {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log(
              "Interval One Tap skipped:",
              notification.getNotDisplayedReason()
            );
          }
        });
      }
    }, 30000); // Check every 30 seconds
  }
});

onUnmounted(() => {
  if (promptInterval) {
    clearInterval(promptInterval);
  }
});

// Track current route (for auth routes)
const isAuthRoute = ref(false);
watch(
  () => router.currentRoute.value.path,
  (path) => {
    isAuthRoute.value = ["/login", "/register", "/verify"].includes(path);
  },
  { immediate: true }
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
  }
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
