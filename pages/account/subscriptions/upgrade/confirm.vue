<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import { cloneDeep } from "lodash";
import {
  definePageMeta,
  navigateTo,
  useBillingAddressStore,
  usePaymentMethodStore,
  useSubscriptionApi,
  useSubscriptionStore,
} from "#imports";
import type { PaymentMethod, BillingAddress } from "~/client";
import BillingAddressDisplay from "~/components/BillingAddressDisplay.vue";
import { Info, Plus } from "lucide-vue-next";

definePageMeta({ layout: "account", middleware: "require-upgradable" });

const subscription = useSubscriptionStore();

const metadata = computed(() => subscription.upgradeMetadata);

const upgradeData = computed(() => subscription.upgradeRequest);

const selectedPlan = computed(() => subscription.selectedPlan);

const formatCurrency = (amount: number) => {
  const roundedAmount = Math.round(amount);
  return `IDR ${new Intl.NumberFormat("en-US").format(roundedAmount)}`;
};

const pmStore = usePaymentMethodStore();
const paymntMethods = computed(() => pmStore.paymentMethods);
const localPaymentMethods = ref<PaymentMethod[]>([]);
const errorMessage = ref<string | null>(null);

// drag handler
const onDragEnd = () => {
  pmStore.syncPaymentMethods(localPaymentMethods.value);
  pmStore.onDragEnd();
};
// buttons
const moveUp = (i: number) => pmStore.moveUp(i);
const moveDown = (i: number) => pmStore.moveDown(i);
const setDefault = async (event: { index: number }) =>
  pmStore.setDefault(event.index);

const handleAddPaymentMethod = (newPm: PaymentMethod) =>
  pmStore.handleAddPaymentMethod(newPm);
const handleUpdatePaymentMethod = (updatedPm: PaymentMethod) => {
  pmStore.handleUpdatePaymentMethod(updatedPm);
  closePaymentFormModal();
};

onMounted(async () => {
  await Promise.all([
    pmStore.initializedPaymentMethods(),
    billAddressStore.initializeBillingAddress(),
  ]);
  if (pmStore.initialized && billAddressStore.initialized) {
    localPaymentMethods.value = cloneDeep(paymntMethods.value);
    if (defaultBillingAddress.value) {
      selectedBillingAddress.value = defaultBillingAddress.value;
      selectedBillingAddressId.value = defaultBillingAddress.value.id;
    }
  }
});

const billAddressStore = useBillingAddressStore();
const isPaymentFormModalOpen = ref(false);
const paymentMethodToEdit = ref<PaymentMethod | null>(null);
const isBillingModalOpen = ref(false);
const isBillingFormModalOpen = ref(false);
const billingAddresses = computed<BillingAddress[]>(
  () => billAddressStore.billingAddresses,
);

const selectedBillingAddressId = ref<string | null>(
  billingAddresses.value[0]?.id || null,
);

const selectedBillingAddress = ref<BillingAddress | null>(null);

const defaultBillingAddress = computed(() => {
  if (billingAddresses.value.length === 1) return billingAddresses.value[0];
  return billingAddresses.value.find((a) => a.isDefault);
});

const addressToEdit = ref<BillingAddress | null>(null);

const openAddPaymentModal = () => {
  paymentMethodToEdit.value = null;
  isPaymentFormModalOpen.value = true;
};

const openEditPaymentModal = (pm: PaymentMethod) => {
  paymentMethodToEdit.value = cloneDeep(pm);
  isPaymentFormModalOpen.value = true;
};

const openAddAddressModal = () => {
  addressToEdit.value = null;
  isBillingFormModalOpen.value = true;
};

const openEditAddressModal = (address: BillingAddress) => {
  addressToEdit.value = { ...address };
  isBillingFormModalOpen.value = true;
};

const closePaymentFormModal = () => {
  isPaymentFormModalOpen.value = false;
  paymentMethodToEdit.value = null;
};

const closeBillingFormModal = () => {
  isBillingFormModalOpen.value = false;
  addressToEdit.value = null;
};

const handleAddNewAddress = () => {
  openAddAddressModal();
};

const handleSaveBillingAddress = (
  address: BillingAddress | Omit<BillingAddress, "id">,
) => {
  if ("id" in address && address.id) {
    const index = billingAddresses.value.findIndex((a) => a.id === address.id);
    if (index !== -1) {
      billingAddresses.value[index] = address as BillingAddress;
    }
  } else {
    const newAddress: BillingAddress = {
      ...address,
      id: `ba_${Date.now()}`,
    } as BillingAddress;
    billingAddresses.value.push(newAddress);
    selectedBillingAddressId.value = newAddress.id;
  }
};

const handleDeleteBillingAddress = (addressId: string) => {
  const index = billingAddresses.value.findIndex((a) => a.id === addressId);
  if (index !== -1) {
    billingAddresses.value.splice(index, 1);
    if (selectedBillingAddressId.value === addressId) {
      selectedBillingAddressId.value = billingAddresses.value[0]?.id || null;
    }
  }
  closeBillingFormModal();
};

const handleUpdateSelectedAddress = (id: string) => {
  console.log("handleUpdateSelectedAddress", id);
  selectedBillingAddressId.value = id;
  selectedBillingAddress.value =
    billingAddresses.value.find((a) => a.id === id) ?? null;
};

const {
  upgrade,
  response,
  error,
  pending: isLoading,
} = useSubscriptionApi().upgrade();

async function handleConfirmAndPay() {
  const id = subscription.activeSubscription?.id;
  if (!id || !subscription.upgradeRequest) return;
  errorMessage.value = null;

  await upgrade(id, subscription.upgradeRequest);
  if (response.value) {
    return await navigateTo("/account/subscriptions/upgrade/success");
  }

  if (error.value) {
    errorMessage.value = error.value.message || "An error occurred";
  }
}
</script>

<template>
  <Content :is-ready="Boolean(metadata)">
    <div class="py-12 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12 max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
          Confirm Your Upgrade
        </h1>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Review your order and confirm your payment details.
        </p>
      </div>

      <div
        v-if="selectedPlan && metadata && upgradeData"
        class="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto"
      >
        <!-- Left Column: Payment and Billing -->
        <div class="lg:col-span-3 space-y-8">
          <!-- Payment Methods -->
          <div
            class="p-8 border border-[var(--text-color)] rounded-md text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)]"
          >
            <div class="flex justify-between items-start mb-6">
              <div>
                <h3 class="text-lg font-semibold leading-6">Payment Methods</h3>
                <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                  Drag to reorder. The top item becomes default.
                </p>
              </div>
              <button
                class="inline-flex items-center gap-2 rounded-lg border border-[var(--text-color)] px-4 py-2 text-sm font-medium shadow-[2px_2px_0_var(--text-color)] hover:shadow-[2px_2px_0_#2563eb] transition-all"
                @click="openAddPaymentModal"
              >
                <Plus class="w-4 h-4" />
                <span>Add Method</span>
              </button>
            </div>
            <PaymentMethodsList
              v-model="localPaymentMethods"
              :loading="!pmStore.initialized"
              @set-default="setDefault"
              @move-up="moveUp"
              @move-down="moveDown"
              @edit="openEditPaymentModal"
              @drag-end="onDragEnd"
            />
          </div>

          <!-- Billing Address -->
          <BillingAddressDisplay
            :loading="false"
            :address="selectedBillingAddress"
            @change="isBillingModalOpen = true"
          />
        </div>

        <!-- Right Column: Order Summary -->
        <div class="lg:col-span-2">
          <div
            class="sticky top-8 p-8 border border-[var(--text-color)] rounded-md text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)]"
          >
            <h2 class="text-2xl font-semibold mb-6">Order Summary</h2>

            <!-- Plan Details -->
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-semibold">
                  {{ selectedPlan.name }} Plan
                </h3>
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

            <!-- Billing & Upgrade Summary -->
            <div class="text-sm space-y-2">
              <div class="flex justify-between">
                <span class="opacity-80">Billing Interval</span>
                <span class="font-medium">{{ metadata.intervalLabel }}</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-80">Subscription Duration</span>
                <span class="font-medium">{{ metadata.recurrenceLabel }}</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-80">Upgrade Timing</span>
                <span class="font-medium">{{
                  metadata.strategy === "UPGRADE_IMMEDIATELY"
                    ? "Immediately"
                    : "End of Cycle"
                }}</span>
              </div>
            </div>

            <hr class="my-6 border-t border-[var(--text-color)] opacity-50" />

            <!-- Pricing Summary -->
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span>Base Price ({{ metadata.intervalLabel }})</span>
                <span>{{ formatCurrency(metadata.basePrice) }}</span>
              </div>
              <div
                v-if="metadata.intervalDiscount.rate"
                class="flex justify-between"
              >
                <span
                  >Billing Interval Discount ({{
                    metadata.intervalDiscount.rate * 100
                  }}%)</span
                >
                <span
                  >-{{ formatCurrency(metadata.intervalDiscount.amount) }}</span
                >
              </div>
              <div v-if="metadata.promoDiscount" class="flex justify-between">
                <span
                  >Promo Code ({{ metadata.promoDiscount.code }} -
                  {{ metadata.promoDiscount.rate * 100 }}%)</span
                >
                <span
                  >-{{ formatCurrency(metadata.promoDiscount.amount) }}</span
                >
              </div>
              <div
                v-if="metadata.proratedCredit.amount > 0"
                class="flex justify-between"
              >
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
                <span
                  >-{{ formatCurrency(metadata.proratedCredit.amount) }}</span
                >
              </div>
              <div
                class="flex justify-between font-bold text-lg border-t border-[var(--text-color)] pt-3 mt-3"
              >
                <span>Total Estimate</span>
                <span>{{ formatCurrency(metadata.totalPrice ?? 0) }}</span>
              </div>
            </div>

            <button
              :disabled="isLoading"
              class="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-lg border-l border-t border-white px-4 py-3 bg-blue-700/80 text-white text-base font-semibold shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleConfirmAndPay"
            >
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              <span>{{ isLoading ? "Subscribing..." : " Confirm & Pay" }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddPaymentMethodModal
      :is-open="isPaymentFormModalOpen"
      :editing-payment-method="paymentMethodToEdit"
      :billing-addresses="billingAddresses"
      :selected-billing-address-id="selectedBillingAddressId || undefined"
      @close="closePaymentFormModal"
      @add-payment-method="handleAddPaymentMethod"
      @update-payment-method="handleUpdatePaymentMethod"
      @update:selected-address="handleUpdateSelectedAddress"
      @add-new-address="handleAddNewAddress"
    />
    <BillingAddressModal
      :is-open="isBillingModalOpen"
      :billing-addresses="billingAddresses"
      :selected-billing-address-id="selectedBillingAddressId || undefined"
      @close="isBillingModalOpen = false"
      @add-address="openAddAddressModal"
      @edit-address="openEditAddressModal"
      @update:selected-address="handleUpdateSelectedAddress"
    />
    <BillingAddressFormModal
      :is-open="isBillingFormModalOpen"
      :editing-address="addressToEdit"
      @close="closeBillingFormModal"
      @save-billing-address="handleSaveBillingAddress"
      @delete-billing-address="handleDeleteBillingAddress"
    />
  </Content>
</template>

<style scoped>
.payment-methods-container {
  position: relative;
}
.payment-method-card {
  position: relative;
  z-index: 1;
}
.payment-method-card.dropdown-open {
  z-index: 99;
}
.divider-container {
  position: relative;
  z-index: 0;
  pointer-events: none;
}
.ghost {
  opacity: 0.5;
  background-color: var(--bg-color);
  border: 2px dashed var(--text-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.ghost .divider-container {
  display: none;
}
.drag {
  transform: translate(2px, 2px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drag .divider-container,
.drag .default {
  display: none;
}
</style>
