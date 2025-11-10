<script setup lang="ts">
import { definePageMeta, ref } from "#imports";
import Content from "~/components/Content.vue";
import { Check } from "lucide-vue-next";

definePageMeta({
  layout: "account",
});

const plans = ref([
  {
    id: "b10bb509-5731-48b9-bb86-40480f836404",
    name: "Free",
    description: "Essential link shortening tools.",
    price: 0,
    features: ["Short Links", "Custom Aliases", "Basic Analytics"],
    upgradable: false,
    badge: null,
  },
  {
    id: "0f21d1f3-d52c-472f-9541-442336bb8f69",
    name: "Starter",
    description: "Grow your personal or small project.",
    price: 75000,
    features: [
      "All Free features",
      "Batch Links (up to 100)",
      "QR Codes",
      "Simple Geo Targeting",
    ],
    upgradable: true,
    badge: null,
  },
  {
    id: "8305ee0c-8df2-481d-82e1-abb35acdf3e3",
    name: "Pro",
    description: "For teams and marketing professionals.",
    price: 225000,
    features: [
      "All Starter features",
      "Advanced Analytics",
      "Device Targeting",
      "Metadata Fetching",
    ],
    upgradable: true,
    badge: {
      text: "Most Popular",
    },
  },
  {
    id: "b6cb733a-0792-4f81-9fff-5ef370dacc24",
    name: "Enterprise",
    description: "Full control and scalability with API access.",
    price: 0,
    features: [
      "All Pro features",
      "Unlimited Batch Links",
      "Dedicated API Key",
      "Priority Support",
    ],
    upgradable: true,
    badge: null,
  },
]);

const formatPrice = (price: number, name: string) => {
  if (name === "Enterprise") return "Contact us";
  if (price === 0) return "Free";
  return `IDR ${price / 1000}K`;
};
</script>

<template>
  <Content :is-ready="true">
    <div class="py-12 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12 max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
          Upgrade Your Plan
        </h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Choose the plan that fits your needs.
        </p>
      </div>

      <!-- Plans Grid -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
      >
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="relative flex flex-col p-8 border border-[var(--text-color)] rounded-md bg-transparent text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_var(--text-color)]"
        >
          <!-- Badge -->
          <div
            v-if="plan.badge"
            class="absolute -top-4 left-1/2 transform -translate-x-1/2"
          >
            <span
              class="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm bg-[var(--text-color)] text-[var(--bg-color)]"
            >
              {{ plan.badge.text }}
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
              <div class="flex items-baseline">
                <span class="text-4xl font-bold tracking-tight">
                  {{ formatPrice(plan.price, plan.name) }}
                </span>
                <span
                  v-if="plan.price > 0 && plan.name !== 'Enterprise'"
                  class="ml-2 text-sm opacity-70"
                >
                  /month
                </span>
              </div>
            </div>

            <!-- Features -->
            <ul class="space-y-3 mb-8">
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
              :disabled="!plan.upgradable"
              class="w-full inline-flex items-center justify-center gap-2 rounded-lg border-l border-t border-white px-4 py-3 text-base font-semibold shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none hover:translate-x-[2px] hover:translate-y-[2px]"
              :class="[
                !plan.upgradable
                  ? 'bg-gray-400 text-gray-800 cursor-not-allowed'
                  : plan.badge
                    ? 'bg-blue-700/80 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
              ]"
            >
              {{
                plan.name === "Enterprise"
                  ? "Contact Sales"
                  : plan.upgradable
                    ? "Choose Plan"
                    : "Current Plan"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Content>
</template>
