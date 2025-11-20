<script setup lang="ts">
import { definePageMeta, navigateTo } from "#imports";
import Content from "~/components/Content.vue";
import { CheckCircle2, CreditCard, Info } from "lucide-vue-next";
import type { SubscriptionInfo } from "~/client";

definePageMeta({
  layout: "account",
  middleware: "require-upgradable"
});

// Mock Data
const mockSubscription: SubscriptionInfo = {
  id: "sub_mock_123456789",
  createdAt: new Date(),
  updatedAt: new Date(),
  referenceId: "ref_mock_987654321",
  externalId: "ext_mock_456123789",
  userId: "user_mock_123",

  plan: {
    name: "Pro",
    description: "Perfect for growing businesses",
    price: 299000,
    limit: 1000,
    cost: 1,
    resetInterval: "Month",
    chargeOnSuccess: true,
    features: ["Unlimited Projects", "Priority Support", "Advanced Analytics"],
  },

  startedAt: new Date(),
  expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
  remaining: 90,
  status: "PENDING",

  isTrial: false,

  schedule: {
    interval: "MONTH",
    intervalCount: 3,
    totalRecurrence: 1,
  },

  transactionStatus: "PENDING",

  metadata: {
    planName: "Pro",
    strategy: "UPGRADE_IMMEDIATELY",

    intervalLabel: "Quarterly",
    recurrenceLabel: "3 months",

    basePrice: 897000, // 299000 * 3
    discount: 0.1,

    intervalDiscountAmount: 89700, // 10%

    promoDiscountAmount: 119550, // 15%

    proratedCredit: {
      amount: 25000,
      description:
        "Credit from the remaining time on your previous plan is automatically applied to this upgrade.",
    },

    total: 782300, // 897000 - 89700 - 25000

    promoCode: {
      code: "SAVE15",
      discount: 0.15,
    },

    intervalDetails: {
      label: "Quarterly",
      value: {
        interval: "MONTH",
        interval_count: 3,
      },
      priceMultiplier: 3,
      discount: 0.1,
    },
  },
  actions: [],
};



const formatCurrency = (amount: number) => {
  return `IDR ${new Intl.NumberFormat("en-US").format(amount)}`;
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const handleBackToSubscription = () => {
  navigateTo("/account/subscriptions");
};
</script>

<template>
  <Content :is-ready="true">
    <div class="py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <!-- Success Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
            <CheckCircle2 class="w-8 h-8" />
          </div>
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Upgrade Request Submitted
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Your subscription upgrade is being processed. Here are the details of your new plan.
          </p>
        </div>

        <!-- Subscription Summary Card -->
        <div class="border border-[var(--text-color)] rounded-xl p-8 shadow-[4px_4px_0_var(--text-color)] bg-[var(--bg-color)]">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-[var(--text-color)] border-dashed">
            <div>
              <h2 class="text-2xl font-bold mb-2">{{ mockSubscription.plan.name }} Plan</h2>
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800">
                  {{ mockSubscription.status }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  Reference: {{ mockSubscription.referenceId }}
                </span>
              </div>
            </div>
            <div class="mt-4 md:mt-0 text-right">
              <div class="text-3xl font-bold">{{ formatCurrency(mockSubscription.plan.price) }}</div>
              <div class="text-sm text-gray-500 dark:text-gray-400">per {{ mockSubscription.schedule.interval.toLowerCase() }}</div>
            </div>
          </div>

            <!-- Payment Breakdown -->
            <div class="col-span-1 md:col-span-2 space-y-6">
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <CreditCard class="w-5 h-5" />
                Payment Breakdown
              </h3>
              
              <div class="bg-gray-50 dark:bg-white/5 rounded-lg p-4 space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">
                    Base Price ({{ mockSubscription.metadata.intervalLabel }})
                  </span>
                  <span class="font-medium">
                    {{ formatCurrency(mockSubscription.metadata.basePrice) }}
                  </span>
                </div>

                <div v-if="mockSubscription.metadata.discount > 0 && mockSubscription.metadata.intervalDiscountAmount > 0" class="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>
                    Interval Discount ({{ (mockSubscription.metadata.discount * 100).toFixed(0) }}%)
                  </span>
                  <span>
                    -{{ formatCurrency(mockSubscription.metadata.intervalDiscountAmount) }}
                  </span>
                </div>

                <div v-if="mockSubscription.metadata.promoCode && mockSubscription.metadata.promoDiscountAmount > 0" class="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>Promo Code ({{ mockSubscription.metadata.promoCode.code }} - {{ (mockSubscription.metadata.promoCode.discount * 100).toFixed(0) }}%)</span>
                  <span>
                    -{{ formatCurrency(mockSubscription.metadata.promoDiscountAmount) }}
                  </span>
                </div>

                <div v-if="mockSubscription.metadata.proratedCredit && mockSubscription.metadata.proratedCredit.amount > 0" class="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <div class="flex items-center">
                    <span>Prorated Credit</span>
                    <div class="relative inline-block group ml-2">
                      <Info class="w-4 h-4 text-[var(--text-color)] cursor-pointer" />
                      <div class="absolute left-1/2 -translate-x-1/2 md:translate-x-0 bottom-full mb-2 min-w-[200px] md:min-w-[300px] text-sm px-4 py-3 flex-1 rounded-lg border border-[var(--text-color)] bg-[var(--bg-color)] font-medium shadow-[2px_2px_0_var(--text-color)] p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-gray-800 dark:text-gray-200 z-10">
                        {{ mockSubscription.metadata.proratedCredit.description }}
                      </div>
                    </div>
                  </div>
                  <span>
                    -{{ formatCurrency(mockSubscription.metadata.proratedCredit.amount) }}
                  </span>
                </div>

                <div class="border-t border-[var(--text-color)]/20 pt-3 mt-3 flex justify-between items-center">
                  <span class="font-semibold">Total Paid</span>
                  <span class="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {{ formatCurrency(mockSubscription.metadata.total) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div class="space-y-1">
                  <div class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Billing Cycle</div>
                  <div class="font-medium capitalize">
                    {{ mockSubscription.metadata.intervalLabel }} 
                    <span class="text-gray-500 font-normal">({{ mockSubscription.metadata.recurrenceLabel }} commitment)</span>
                  </div>
                </div>
                
                <div class="space-y-1">
                  <div class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Upgrade Strategy</div>
                  <div class="font-medium">
                    {{ mockSubscription.metadata.strategy === 'UPGRADE_IMMEDIATELY' ? 'Immediate Upgrade' : 'End of Cycle' }}
                  </div>
                </div>

                <div class="space-y-1">
                  <div class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Next Billing Date</div>
                  <div class="font-medium">
                    {{ mockSubscription.nextBillingDate ? formatDate(mockSubscription.nextBillingDate) : 'N/A' }}
                  </div>
                </div>

                <div class="space-y-1">
                  <div class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Transaction Status</div>
                  <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {{ mockSubscription.transactionStatus }}
                  </div>
                </div>
              </div>
            </div>

          <!-- Action Buttons -->
          <div class="mt-10 pt-8 border-t border-[var(--text-color)] border-dashed flex justify-center">
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
