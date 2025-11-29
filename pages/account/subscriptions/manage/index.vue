<script setup lang="ts">
import { definePageMeta, navigateTo, useRoute } from "#imports";
import Content from "~/components/Content.vue";
import { CreditCard, Info, X } from "lucide-vue-next";
import type { SubscriptionInfo } from "~/client";
import { useSubscriptionApi } from "~/composables/useSubscriptionApi";
import { onMounted, ref } from "vue";
import type { UpgradeMetadata } from "~/interfaces/subscriptions";
import camelcaseKeys from "camelcase-keys";

definePageMeta({
  layout: "account",
});

const route = useRoute();
const subscriptionApi = useSubscriptionApi();
const subscription = ref<SubscriptionInfo | null>(null);
const metadata = ref<UpgradeMetadata | null>(null);
const errorMessage = ref<string | null>(null);
const initialized = ref(false);

const isWebviewModalOpen = ref(false);
const webviewUrl = ref("");

const openPaymentModal = (url: string) => {
  webviewUrl.value = url;
  isWebviewModalOpen.value = true;
};

const closePaymentModal = () => {
  isWebviewModalOpen.value = false;
  webviewUrl.value = "";
};

const {
  getSubscriptionById,
  pending: isLoading,
  error,
  response,
} = subscriptionApi.getById();

const initializedSubscription = async (id: string) => {
  if (initialized.value) return;
  errorMessage.value = null;
  await getSubscriptionById(id);
  if (response.value) {
    subscription.value = response.value.data;
    if (response.value.data.metadata) {
      // Check if metadata exists
      metadata.value = camelcaseKeys(
        response.value.data.metadata,
        { deep: true } // use deep for nested objects
      ) as UpgradeMetadata;
      console.log(metadata.value);
    }
  }
  if (error.value) {
    errorMessage.value = error.value.message || "An error occurred";
  }
  initialized.value = true;
};

onMounted(async () => {
  const id = route.query.id as string;
  if (!id) {
    await navigateTo("/account/subscriptions");
    return;
  }
  await initializedSubscription(id);
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
  <Content :is-ready="initialized && Boolean(subscription)">
    <div v-if="subscription" class="">
      <!-- Subscription Summary Card -->
      <div class="box-inner-card p-4 sm:p-8">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-(--text-color) border-dashed"
        >
          <div>
            <h2 class="text-2xl font-bold mb-2">
              {{ subscription.plan.name }} Plan
            </h2>
            <div class="flex items-center gap-2">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="{
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800':
                    subscription.status === 'PENDING',
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 border border-green-200 dark:border-green-800':
                    subscription.status === 'ACTIVE',
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 border border-red-200 dark:border-red-800':
                    subscription.status === 'INACTIVE' ||
                    subscription.status === 'EXPIRED',
                }"
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <h3 class="text-lg font-semibold flex items-center gap-2 mt-7">
            <CreditCard class="w-5 h-5" />
            Payment Breakdown
          </h3>

          <div
            class="bg-gray-200/40 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
          >
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">
                Base Price ({{ metadata.intervalLabel }})
              </span>
              <span class="font-medium">
                {{ formatCurrency(metadata.basePrice) }}
              </span>
            </div>

            <div
              v-if="metadata.intervalDiscount"
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
              v-if="metadata.promoDiscount && metadata.promoDiscount.amount > 0"
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
                  <Info class="w-4 h-4 text-(--text-color) cursor-pointer" />
                  <div
                    class="absolute left-1/2 -translate-x-1/2 md:translate-x-0 bottom-full mb-2 min-w-[200px] md:min-w-[300px] text-sm px-4 py-3 flex-1 rounded-lg border border-(--text-color) bg-(--bg-color) font-medium shadow-[2px_2px_0_var(--text-color)] p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-gray-800 dark:text-gray-200 z-10"
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
              class="border-t border-(--border-color)/50 pt-3 mt-3 flex justify-between items-center"
            >
              <span class="font-semibold">Total Paid</span>
              <span class="text-xl font-bold text-blue-600 dark:text-blue-400">
                {{ formatCurrency(metadata.totalPrice) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="mt-10 pt-8 border-t border-(--border-color) border-dashed flex justify-center gap-4"
        >
          <button
            class="box-shadow-card px-4 py-3 hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_var(--text-color)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            @click="handleBackToSubscription"
          >
            Back to Subscriptions
          </button>
          <button
            v-if="subscription?.actions && subscription.actions[0]"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 px-6 py-3 font-semibold shadow-[2px_2px_0_blue] text-white hover:bg-blue-700 hover:border-blue-700 hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_blue] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            @click="openPaymentModal(subscription.actions[0].url)"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>

    <!-- Webview Modal -->
    <div
      v-if="isWebviewModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      @click.self="closePaymentModal"
    >
      <div
        class="bg-(--bg-color) rounded-xl w-full max-w-lg h-[90vh] flex flex-col border border-(--text-color) shadow-[4px_4px_0_var(--text-color)]"
      >
        <div
          class="flex items-center justify-between p-4 border-b border-(--text-color)"
        >
          <h3 class="text-lg font-semibold">Complete Payment</h3>
          <button
            class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            @click="closePaymentModal"
          >
            <X class="w-6 h-6" />
          </button>
        </div>
        <div class="flex-1 p-1">
          <iframe
            :src="webviewUrl"
            class="w-full h-full border-0 rounded-b-lg"
          ></iframe>
        </div>
      </div>
    </div>
  </Content>
</template>
