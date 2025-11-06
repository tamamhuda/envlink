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
          class="flex items-center gap-2 hover:opacity-90 transition-opacity"
          @click="navigateHome"
        >
          <h1 class="text-xl font-semibold tracking-tight">Envlink</h1>
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
            <span v-if="isClientOnly && !isAuthRoute && !isAuthenticcated"
              >Quick Start</span
            >
            <span v-else-if="isClientOnly && isAuthenticcated">Dashboard</span>
            <span v-else>Quick Try</span>
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Slot for Auth Routes -->
    <slot />

    <!-- Main Home Content -->
    <main v-if="!isAuthRoute" class="flex-1 pt-20 w-full">
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
            <input
              type="text"
              placeholder="Paste your long URL here"
              class="w-full mb-4 rounded-md border border-[var(--text-color)] bg-transparent px-4 py-2 text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-color)]"
            />
            <button
              class="inline-block w-full rounded-md border border-[var(--text-color)] px-4 py-2 font-medium shadow-[4px_4px_0_var(--text-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)] transition-all bg-transparent text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--text-color)]"
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
        <h3 class="text-3xl font-semibold mb-10 tracking-tight">Pricing</h3>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full"
        >
          <PlanCard
            name="Free"
            description="Essential link shortening tools."
            price="$0 / month"
            :features="['Short Links', 'Custom Aliases', 'Basic Analytics']"
            cta="Get Started"
          />

          <PlanCard
            name="Starter"
            description="Grow your personal or small project."
            price="$5 / month"
            :features="[
              'All Free features',
              'Batch Links (up to 100)',
              'QR Codes',
              'Simple Geo Targeting',
            ]"
            cta="Start Now"
          />

          <PlanCard
            name="Pro"
            description="For teams and marketing professionals."
            price="$15 / month"
            :features="[
              'All Starter features',
              'Advanced Analytics',
              'Device Targeting',
              'Metadata Fetching',
            ]"
            cta="Upgrade"
          />

          <PlanCard
            name="Enterprise (Developer API)"
            description="Full control and scalability with API access."
            price="Contact us"
            :features="[
              'All Pro features',
              'Unlimited Batch Links',
              'Dedicated API Key',
              'Priority Support',
            ]"
            cta="Contact Sales"
          />
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
} from "#imports";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

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
