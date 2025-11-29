<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { definePageMeta, navigateTo, useSubscriptionStore } from "#imports";
import { Check, Info, X } from "lucide-vue-next";
import FormInput from "~/components/FormInput.vue";
import Content from "~/components/Content.vue";
import type {
  RecurrenceOption,
  ScheduleInterval,
  UpgradeDetails,
  UpgradeStrategy,
} from "~/interfaces/subscriptions";

definePageMeta({ layout: "account", middleware: "require-upgradable" });

const subscription = useSubscriptionStore();
const scheduleIntervals: ScheduleInterval[] = [
  {
    label: "Monthly",
    value: { interval: "MONTH", intervalCount: 1 },
    priceMultiplier: 1,
  },
  {
    label: "Quarterly",
    value: { interval: "MONTH", intervalCount: 3 },
    priceMultiplier: 3,
    discount: 0.1,
  },
  {
    label: "Yearly",
    value: { interval: "YEAR", intervalCount: 1 },
    priceMultiplier: 12,
    discount: 0.2,
  },
];

const recurrenceOptions: RecurrenceOption[] = [
  { label: "3 months", value: 3 },
  { label: "6 months", value: 6 },
  { label: "12 months", value: 12 },
  { label: "24 months", value: 24 },
];

const selectedPlan = computed(() => subscription.selectedPlan);

const upgradeOptions = selectedPlan.value?.options ?? [];

const upgradeTimingDetails = {
  UPGRADE_IMMEDIATELY: {
    label: "Immediately",
    desc: "Start your new plan now. Credits unused time.",
  },
  FINISH_CURRENT_CYCLE: {
    label: "End of Current Cycle",
    desc: "Starts when your current billing cycle ends.",
  },
};

const upgradeStrategy = ref<UpgradeStrategy>("UPGRADE_IMMEDIATELY");
const selectedInterval = ref<ScheduleInterval>(scheduleIntervals[0]!);
const selectedRecurrence = ref<RecurrenceOption>(recurrenceOptions[2]!);

const promoCodeInput = ref("");
const promoCodeError = ref("");
const appliedPromoCode = ref<{ code: string; discount: number } | null>(null);

const MOCK_PROMO_CODES = {
  SAVE15: 0.15,
  BIGDISCOUNT: 0.5,
};

const formatCurrency = (amount: number) => {
  const roundedAmount = Math.round(amount);
  return `IDR ${new Intl.NumberFormat("en-US").format(roundedAmount)}`;
};

watch(selectedInterval, (newInterval) => {
  if (!newInterval || !selectedRecurrence.value) return;

  if (newInterval.label === "Yearly" && selectedRecurrence.value.value < 12) {
    selectedRecurrence.value = recurrenceOptions.find((r) => r.value === 12)!;
  }

  if (newInterval.label === "Quarterly" && selectedRecurrence.value.value < 6) {
    selectedRecurrence.value = recurrenceOptions.find((r) => r.value === 6)!;
  }
});

const computedSchedule = computed(() => ({
  interval: selectedInterval.value.value.interval || "MONTH",
  intervalCount: selectedInterval.value.value.intervalCount || 1,
  totalRecurrance:
    selectedRecurrence.value.value / selectedInterval.value.priceMultiplier ||
    12,
}));

const promoDiscountAmount = computed(() => {
  if (!appliedPromoCode.value || !selectedPlan.value) return 0;

  const base =
    selectedPlan.value.price * selectedInterval!.value!.priceMultiplier!;
  const intervalDiscount = selectedInterval.value.discount ?? 0;
  const subtotal = base * (1 - intervalDiscount);

  return subtotal * appliedPromoCode.value.discount;
});

const proratedCredit = computed(() => {
  if (upgradeStrategy.value === "UPGRADE_IMMEDIATELY") {
    const option = upgradeOptions.find(
      (o) => o.strategy === "UPGRADE_IMMEDIATELY",
    );
    return option ? option.remainingCredit : 0;
  }
  return 0;
});

const computedTotal = computed(() => {
  const base =
    selectedPlan.value!.price * selectedInterval!.value!.priceMultiplier!;
  const intervalDiscount = selectedInterval?.value?.discount ?? 0;
  const subtotal = base * (1 - intervalDiscount);

  return subtotal - promoDiscountAmount.value - proratedCredit.value;
});

const isRecurrenceDisabled = (recurrenceValue: number) => {
  if (selectedInterval?.value?.label === "Quarterly")
    return recurrenceValue < 6;
  if (selectedInterval?.value?.label === "Yearly") return recurrenceValue < 12;
  return false;
};

function applyPromoCode() {
  promoCodeError.value = "";
  const code = promoCodeInput.value.toUpperCase();
  if (code in MOCK_PROMO_CODES) {
    appliedPromoCode.value = {
      code,
      discount: MOCK_PROMO_CODES[code as keyof typeof MOCK_PROMO_CODES],
    };
    promoCodeInput.value = "";
  } else {
    promoCodeError.value = "Invalid promo code.";
  }
}

function removePromoCode() {
  appliedPromoCode.value = null;
}

const upgradeDetails = computed<UpgradeDetails>(() => {
  const intervalDetails = scheduleIntervals.find(
    (i) =>
      i.value.interval === computedSchedule.value.interval &&
      i.value.intervalCount === computedSchedule.value.intervalCount,
  );
  const recurrence = recurrenceOptions.find(
    (r) => r.value === computedSchedule.value.totalRecurrance,
  );

  const base = intervalDetails
    ? selectedPlan.value!.price * intervalDetails.priceMultiplier
    : 0;

  const intervalDiscount = intervalDetails?.discount
    ? {
        rate: intervalDetails.discount,
        amount: base * intervalDetails.discount,
      }
    : null;

  const subtotal = base - (intervalDiscount?.amount ?? 0);

  const promoDiscount = appliedPromoCode.value
    ? {
        code: appliedPromoCode.value.code,
        rate: appliedPromoCode.value.discount,
        amount: subtotal * appliedPromoCode.value.discount,
      }
    : null;

  const schedule = computedSchedule.value;

  return {
    planName: selectedPlan.value?.name || "Free",
    strategy: upgradeStrategy.value,
    intervalLabel: intervalDetails?.label || "Monthly",
    recurrenceLabel: recurrence?.label || "3 Month",
    totalPrice: computedTotal.value,
    basePrice: base,
    discount: selectedInterval.value.discount ?? 0,
    promoCode: appliedPromoCode.value,
    intervalDiscount,
    promoDiscount,
    proratedCredit: {
      amount: proratedCredit.value,
      description: "Prorated credit for the current billing period",
    },
    selectedInterval: {
      ...schedule,
      priceMultiplier: selectedInterval.value.priceMultiplier,
    },
    recurrenceDetails: recurrence,
  };
});

function continueToConfirmation() {
  if (!selectedPlan.value) return;
  const details = upgradeDetails.value;
  subscription.setUpgradeRequest(details);
  navigateTo("/account/subscriptions/upgrade/confirm");
}
</script>

<template>
  <Content :is-ready="Boolean(selectedPlan)">
    <div class="py-12 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12 max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
          Upgrade Subscription
        </h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Review your new plan and billing setup before confirming.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
        <!-- Left Column -->
        <div class="lg:col-span-3 space-y-8">
          <!-- Combined Billing + Upgrade Timing -->
          <section
            class="p-8 border border-[var(--text-color)] rounded-md text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)] space-y-10"
          >
            <h2 class="text-2xl font-semibold">Billing & Upgrade Setup</h2>

            <!-- Interval Selection -->
            <div>
              <h3 class="text-lg font-semibold mb-3">Billing Interval</h3>
              <div class="flex flex-wrap gap-3 mb-8 w-full">
                <button
                  v-for="interval in scheduleIntervals"
                  :key="interval.label"
                  class="flex-1 px-4 py-3 rounded-lg border border-[var(--text-color)] transition-all font-medium shadow-[2px_2px_0_var(--text-color)] hover:shadow-[2px_2px_0_#2563eb]"
                  :class="{
                    'bg-[var(--text-color)] text-[var(--bg-color)] !shadow-[2px_2px_0_#2563eb]':
                      selectedInterval!.label === interval.label,
                  }"
                  type="button"
                  @click="selectedInterval = interval"
                >
                  {{ interval.label }}
                </button>
              </div>
            </div>

            <!-- Recurrence Selection -->
            <div>
              <h3 class="text-lg font-semibold mb-3">Subscription Duration</h3>
              <div class="flex flex-wrap gap-3 w-full">
                <button
                  v-for="option in recurrenceOptions"
                  :key="option.value"
                  class="px-4 py-3 flex-1 rounded-lg border border-[var(--text-color)] transition-all font-medium shadow-[2px_2px_0_var(--text-color)]"
                  :class="{
                    'bg-[var(--text-color)] text-[var(--bg-color)] !shadow-[2px_2px_0_#2563eb]':
                      selectedRecurrence!.value === option.value,
                    'opacity-50 cursor-not-allowed': isRecurrenceDisabled(
                      option.value,
                    ),
                    'hover:shadow-[2px_2px_0_#2563eb]': !isRecurrenceDisabled(
                      option.value,
                    ),
                  }"
                  type="button"
                  :disabled="isRecurrenceDisabled(option.value)"
                  @click="selectedRecurrence = option"
                >
                  {{ option.label }}
                </button>
              </div>
            </div>

            <!-- Upgrade Timing -->
            <div>
              <div class="flex items-center mb-4">
                <h3 class="text-lg font-semibold">Upgrade Timing</h3>
                <div class="relative inline-block group ml-2">
                  <Info
                    class="w-4 h-4 text-[var(--text-color)] cursor-pointer"
                  />
                  <div
                    class="absolute left-1/2 -translate-x-1/2 md:translate-x-0 bottom-full mb-2 min-w-[80vw] md:min-w-[400px] text-sm px-4 py-3 flex-1 rounded-lg border border-[var(--text-color)] bg-[var(--bg-color)] font-medium shadow-[2px_2px_0_var(--text-color)] p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  >
                    Choose when your upgrade takes effect.
                    <br /><br />
                    <strong>Immediately</strong>: Start the new plan now; unused
                    time is credited.
                    <br />
                    <strong>End of Current Cycle</strong>: Begin at your next
                    billing cycle.
                  </div>
                </div>
              </div>

              <div class="flex flex-col md:flex-row gap-4">
                <div
                  v-for="option in upgradeOptions"
                  :key="option.strategy"
                  class="border border-[var(--text-color)] rounded-lg p-6 flex items-center flex-1 transition-all shadow-[2px_2px_0_var(--text-color)]"
                  :class="{
                    'bg-[var(--text-color)] text-[var(--bg-color)] !shadow-[2px_2px_0_#2563eb]':
                      upgradeStrategy === option.strategy,
                    'opacity-50 cursor-not-allowed': !option.upgradable,
                    'hover:shadow-[2px_2px_0_#2563eb] cursor-pointer':
                      option.upgradable,
                  }"
                  @click="
                    option.upgradable
                      ? (upgradeStrategy = option.strategy)
                      : null
                  "
                >
                  <div class="font-semibold">
                    {{ upgradeTimingDetails[option.strategy].label }}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Column -->
        <div v-if="selectedPlan" class="lg:col-span-2">
          <div
            class="sticky top-8 p-8 border border-[var(--text-color)] rounded-md text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)]"
          >
            <h2 class="text-2xl font-semibold mb-6">Order Summary</h2>

            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-semibold">{{ selectedPlan.name }}</h3>
                <p class="mt-2 text-sm opacity-80">
                  {{ selectedPlan.description }}
                </p>
              </div>
              <div class="text-right ml-4">
                <p class="text-3xl font-bold">
                  {{ formatCurrency(selectedPlan.price) }}
                </p>
                <p class="opacity-70 text-sm">per month</p>
              </div>
            </div>

            <hr class="my-6 border-t border-[var(--text-color)] opacity-50" />

            <div>
              <h4 class="font-semibold mb-4">Features included:</h4>
              <ul class="space-y-3">
                <li
                  v-for="feature in selectedPlan.features"
                  :key="feature"
                  class="flex items-start"
                >
                  <Check class="w-5 h-5 mt-0.5 text-[var(--text-color)]" />
                  <span class="ml-3 text-sm">{{ feature }}</span>
                </li>
              </ul>
            </div>

            <hr class="my-6 border-t border-[var(--text-color)] opacity-50" />

            <!-- Promo Code Section -->
            <div>
              <div v-if="!appliedPromoCode">
                <label
                  for="promo-code"
                  class="block text-sm font-medium text-[var(--text-color)] opacity-90 mb-1.5"
                  >Promo Code</label
                >
                <div class="flex gap-2 items-start w-full">
                  <FormInput
                    id="promo-code"
                    v-model="promoCodeInput"
                    label=""
                    placeholder="Enter code"
                    :error="promoCodeError"
                    class="flex-1"
                    @keyup.enter="applyPromoCode"
                  />
                  <button
                    class="shrink-0 inline-flex items-center justify-center rounded-lg border border-[var(--text-color)] px-4 h-[46px] font-semibold hover:translate-x-[1px] hover:translate-y-[1px] transition-all shadow-[2px_2px_0_var(--text-color)] hover:shadow-[1px_1px_0_var(--text-color)] disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="!promoCodeInput"
                    @click="applyPromoCode"
                  >
                    Use
                  </button>
                </div>
              </div>
              <div v-else>
                <p
                  class="text-sm font-medium text-[var(--text-color)] opacity-90 mb-1.5"
                >
                  Promo Code
                </p>
                <div
                  class="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-medium px-2.5 py-1 rounded-full"
                >
                  <span>{{ appliedPromoCode.code }}</span>
                  <button class="ml-1 text-current" @click="removePromoCode">
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <hr class="my-6 border-t border-[var(--text-color)] opacity-50" />

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span>Base Price ({{ selectedInterval?.label }})</span>
                <span>{{
                  formatCurrency(
                    selectedPlan.price * selectedInterval!.priceMultiplier!,
                  )
                }}</span>
              </div>
              <div
                v-if="selectedInterval?.discount"
                class="flex justify-between"
              >
                <span
                  >Billing Interval Discount ({{
                    selectedInterval.discount * 100
                  }}%)</span
                >
                <span
                  >-{{
                    formatCurrency(
                      selectedPlan.price *
                        selectedInterval.priceMultiplier *
                        selectedInterval.discount,
                    )
                  }}</span
                >
              </div>
              <div v-if="appliedPromoCode" class="flex justify-between">
                <span
                  >Promo Code ({{ appliedPromoCode.code }} -
                  {{ appliedPromoCode.discount * 100 }}%)</span
                >
                <span>-{{ formatCurrency(promoDiscountAmount) }}</span>
              </div>
              <div v-if="proratedCredit > 0" class="flex justify-between">
                <div class="flex items-center">
                  <span>Prorated Credit</span>
                  <div class="relative inline-block group ml-2">
                    <Info
                      class="w-4 h-4 text-[var(--text-color)] cursor-pointer"
                    />
                    <div
                      class="absolute left-1/2 -translate-x-1/2 md:translate-x-0 bottom-full mb-2 min-w-[80vw] md:min-w-[300px] text-sm px-4 py-3 flex-1 rounded-lg border border-[var(--text-color)] bg-[var(--bg-color)] font-medium shadow-[2px_2px_0_var(--text-color)] p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    >
                      Credit from the remaining time on your current plan is
                      automatically applied to this upgrade.
                    </div>
                  </div>
                </div>
                <span>-{{ formatCurrency(proratedCredit) }}</span>
              </div>
              <div
                class="flex justify-between font-bold text-lg border-t border-[var(--text-color)] pt-3 mt-3"
              >
                <span>Total Estimate</span>
                <span>{{ formatCurrency(computedTotal) }}</span>
              </div>
            </div>

            <button
              class="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--text-color)] px-4 py-3 font-semibold bg-blue-700/80 text-white hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              @click="continueToConfirmation"
            >
              Continue to Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  </Content>
</template>
