<script setup lang="ts">
import {
  computed,
  definePageMeta,
  navigateTo,
  useSubscriptionStore,
} from "#imports";
import Content from "~/components/Content.vue";
import { Check } from "lucide-vue-next";
import type { SubscriptionUpgradeOption } from "~/client";

definePageMeta({
  layout: "account",
});

const subscription = useSubscriptionStore();

const badge = (plan: SubscriptionUpgradeOption) => {
  if (plan.name === "Enterprise") {
    return {
      text: "Soon",
    };
  }
  if (plan.name === "Starter") {
    return {
      text: "Most Popular",
    };
  }
  return null;
};

const plans = computed(() =>
  subscription.availablePlans.map((plan) => {
    return {
      ...plan,
      badge: badge(plan),
    };
  })
);

const formatPrice = (price: number, name: string) => {
  if (name === "Enterprise") return "Contact us";
  if (price === 0) return "Free";
  return `IDR ${price / 1000}K`;
};

const handleSelectPlan = (id: string) => {
  subscription.selectPlan(id);
  console.log("Selected Plan:", subscription.selectedPlan);
  navigateTo("/account/subscriptions/upgrade/preview");
};
</script>

<template>
  <Content :is-ready="subscription.initialized">
    <div class="py-12 px-4 sm:px-6 lg:px-4 min-h-full">
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
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-full w-full"
      >
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="box-shadow-card p-8 flex flex-col relative hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_var(--shadow-color)] transition-all"
        >
          <!-- Badge -->
          <div
            v-if="plan.badge"
            class="absolute -top-4 left-1/2 transform -translate-x-1/2"
          >
            <span
              class="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm bg-(--primary-color) text-white"
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
                <Check class="shrink-0 w-5 h-5 text-(--text-color) mt-0.5" />
                <span class="ml-3 text-sm">
                  {{ feature }}
                </span>
              </li>
            </ul>
          </div>

          <!-- CTA Button -->
          <div class="pt-0 flex items-center justify-center">
            <button
              :disabled="
                (!plan.upgradable && plan.name !== plan.currentPlan) ||
                plan.name === 'Enterprise'
              "
              :class="{
                'button-box':
                  plan.popular || plan.upgradable || plan.name === 'Enterprise',
                'button-box verbose':
                  !plan.upgradable && plan.name !== 'Enterprise',
              }"
              @click="handleSelectPlan(plan.id)"
            >
              {{
                plan.name === "Enterprise" || plan.name === "Free"
                  ? plan.cta
                  : plan.name !== plan.currentPlan
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
