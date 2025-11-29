<script setup lang="ts">
import {
  definePageMeta,
  navigateTo,
  useRoute,
  useSubscriptionStore,
} from "#imports";
import Content from "~/components/Content.vue";
import { CheckCircle2, CreditCard, Info } from "lucide-vue-next";
import type { SubscriptionInfo } from "~/client";
import { useSubscriptionApi } from "~/composables/useSubscriptionApi";
import { onMounted, ref } from "vue";
import type { UpgradeMetadata } from "~/interfaces/subscriptions";

definePageMeta({
  layout: "account",
  middleware: "require-upgradable",
});

const subscriptions = useSubscriptionStore();
const subscription = ref<SubscriptionInfo | null>(null);
const metadata = ref<UpgradeMetadata | null>(subscriptions.upgradeMetadata);

onMounted(async () => {
  if (import.meta.client && subscriptions.pendingSubscription) {
    subscription.value = subscriptions.pendingSubscription;
  }
});

const formatCurrency = (amount: number) => {
  return `IDR ${new Intl.NumberFormat("en-US").format(amount)}`;
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

const handleBackToSubscription = () => {
  navigateTo("/account/subscriptions");
};
</script>

<template>
  <Content :is-ready="!!subscription">
    <div v-if="subscription" class="py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <!-- Success Header -->
        <div class="text-center mb-12">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6"
          >
            <CheckCircle2 class="w-8 h-8" />
          </div>
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Upgrade Request Submitted
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Your subscription upgrade is being processed. Here are the details
            of your new plan.
          </p>
        </div>

        <!-- Subscription Summary Card -->
        <div
          class="border border-[var(--text-color)] rounded-xl p-8 shadow-[4px_4px_0_var(--text-color)] bg-[var(--bg-color)]"
        >
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-[var(--text-color)] border-dashed"
          >
            <div>
              <h2 class="text-2xl font-bold mb-2">
                {{ subscription.plan.name }} Plan
              </h2>
              <div class="flex items-center gap-2">
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800"
                >
                  {{ subscription.status }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  Reference: {{ subscription.referenceId }}
                </span>
              </div>
            </div>
            <div class="mt-4 md:mt-0 text-right">
              <div class="text-3xl font-bold">
                {{ formatCurrency(subscription.plan.price) }}
              </div>
              <div
                v-if="subscription.schedule"
                class="text-sm text-gray-500 dark:text-gray-400"
              >
                per {{ subscription.schedule.interval.toLowerCase() }}
              </div>
            </div>
          </div>

          <!-- Payment Breakdown -->
          <div v-if="metadata" class="col-span-1 md:col-span-2 space-y-6">
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <CreditCard class="w-5 h-5" />
              Payment Breakdown
            </h3>

            <div class="bg-gray-50 dark:bg-white/5 rounded-lg p-4 space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">
                  Base Price ({{ metadata.intervalLabel }})
                </span>
                <span class="font-medium">
                  {{ formatCurrency(metadata.basePrice) }}
                </span>
              </div>

              <div
                v-if="
                  metadata.intervalDiscount.amount > 0 &&
                  metadata.intervalDiscount.rate
                "
                class="flex justify-between text-sm text-green-600 dark:text-green-400"
              >
                <span>
                  Interval Discount ({{
                    (metadata.intervalDiscount.rate * 100).toFixed(0)
                  }}%)
                </span>
                <span>
                  -{{ formatCurrency(metadata.intervalDiscount.amount) }}
                </span>
              </div>

              <div
                v-if="
                  metadata.promoDiscount && metadata.promoDiscount.amount > 0
                "
                class="flex justify-between text-sm text-green-600 dark:text-green-400"
              >
                <span
                  >Promo Code ({{ metadata.promoDiscount.code }} -
                  {{ (metadata.promoDiscount.rate * 100).toFixed(0) }}%)</span
                >
                <span>
                  -{{ formatCurrency(metadata.promoDiscount.amount) }}
                </span>
              </div>

              <div
                v-if="
                  metadata.proratedCredit && metadata.proratedCredit.amount > 0
                "
                class="flex justify-between text-sm text-green-600 dark:text-green-400"
              >
                <div class="flex items-center">
                  <span>Prorated Credit</span>
                  <div class="relative inline-block group ml-2">
                    <Info
                      class="w-4 h-4 text-[var(--text-color)] cursor-pointer"
                    />
                    <div
                      class="absolute left-1/2 -translate-x-1/2 md:translate-x-0 bottom-full mb-2 min-w-[200px] md:min-w-[300px] text-sm px-4 py-3 flex-1 rounded-lg border border-[var(--text-color)] bg-[var(--bg-color)] font-medium shadow-[2px_2px_0_var(--text-color)] p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-gray-800 dark:text-gray-200 z-10"
                    >
                      {{ metadata.proratedCredit.description }}
                    </div>
                  </div>
                </div>
                <span>
                  -{{ formatCurrency(metadata.proratedCredit.amount) }}
                </span>
              </div>

              <div
                class="border-t border-[var(--text-color)]/20 pt-3 mt-3 flex justify-between items-center"
              >
                <span class="font-semibold">Total Paid</span>
                <span
                  class="text-xl font-bold text-blue-600 dark:text-blue-400"
                >
                  {{ formatCurrency(metadata.totalPrice) }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div class="space-y-1">
                <div
                  class="text-xs text-gray-500 uppercase tracking-wider font-semibold"
                >
                  Billing Cycle
                </div>
                <div class="font-medium capitalize">
                  {{ metadata.intervalLabel }}
                  <span class="text-gray-500 font-normal"
                    >({{ metadata.recurrenceLabel }} commitment)</span
                  >
                </div>
              </div>

              <div class="space-y-1">
                <div
                  class="text-xs text-gray-500 uppercase tracking-wider font-semibold"
                >
                  Upgrade Strategy
                </div>
                <div class="font-.medium">
                  {{
                    metadata.strategy === "UPGRADE_IMMEDIATELY"
                      ? "Immediate Upgrade"
                      : "End of Cycle"
                  }}
                </div>
              </div>

              <div class="space-y-1">
                <div
                  class="text-xs text-gray-500 uppercase tracking-wider font-semibold"
                >
                  Next Billing Date
                </div>
                <div class="font-medium">
                  {{ formatDate(subscription.nextBillingDate) }}
                </div>
              </div>

              <div class="space-y-1">
                <div
                  class="text-xs text-gray-500 uppercase tracking-wider font-semibold"
                >
                  Transaction Status
                </div>
                <div
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                >
                  {{ subscription.transactionStatus }}
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            class="mt-10 pt-8 border-t border-[var(--text-color)] border-dashed flex justify-center"
          >
            <button
              class="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--text-color)] px-6 py-3 font-semibold shadow-[2px_2px_0_var(--text-color)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_var(--text-color)] transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              @click="handleBackToSubscription"
            >
              Back to Subscriptions
            </button>
          </div>
        </div>
      </div>
    </div>
  </Content>
</template>
