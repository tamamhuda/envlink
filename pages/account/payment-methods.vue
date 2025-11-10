<script setup lang="ts">
import { computed, definePageMeta, ref } from "#imports";
import type { components } from "~/types/api.d";
import Content from "~/components/Content.vue";
import AddPaymentMethodModal from "~/components/AddPaymentMethodModal.vue";
import BillingAddressModal from "~/components/BillingAddressModal.vue";
import { CreditCard, Plus, GripVertical } from "lucide-vue-next";
import draggable from "vuedraggable";

definePageMeta({ layout: "account" });

type PaymentMethod =
  components["schemas"]["AllPaymentMethodsResponse"]["data"][number];

const paymentMethods = ref<PaymentMethod[]>([
  {
    id: "pm_1",
    type: "CARD",
    is_default: true,
    card: {
      network: "Visa",
      masked_card_number: "**** **** **** 1234",
      expiry_month: "12",
      expiry_year: "2025",
      card_holder_name: "John Doe",
      card_type: "credit",
      issuer: "Chase",
    },
    user_id: "user_123",
    external_id: "ext_pm_1",
    reusability: "REUSABLE",
    country: "US",
    currency: "USD",
    status: "ACTIVE",
    channel_code: "VISA",
    provider: "stripe",
    failure_code: null,
    custom_name: "Personal Card",
    direct_debit: null,
    ewallet: null,
    recurring_expiry: null,
    recurring_frequency: null,
    rank: 1,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "pm_2",
    type: "CARD",
    is_default: false,
    card: {
      network: "Mastercard",
      masked_card_number: "**** **** **** 5678",
      expiry_month: "06",
      expiry_year: "2024",
      card_holder_name: "John Doe",
      card_type: "debit",
      issuer: "Bank of America",
    },
    user_id: "user_123",
    external_id: "ext_pm_2",
    reusability: "REUSABLE",
    country: "US",
    currency: "USD",
    status: "ACTIVE",
    channel_code: "MASTERCARD",
    provider: "stripe",
    failure_code: null,
    custom_name: "Work Card",
    direct_debit: null,
    ewallet: null,
    recurring_expiry: null,
    recurring_frequency: null,
    rank: 2,
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]);

const drag = ref(false);
const isPaymentModalOpen = ref(false);
const isBillingModalOpen = ref(false);
const modalView = ref("payment"); // 'payment' or 'billing'

type BillingAddress = {
  id: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
};

const billingAddresses = ref<BillingAddress[]>([
  {
    id: "ba_1",
    address1: "123 Main St",
    address2: "Apt 4B",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    country: "USA",
  },
]);
const selectedBillingAddressId = ref<string | null>(
  billingAddresses.value[0]?.id || null,
);

const selectedBillingAddress = computed(() => {
  return billingAddresses.value.find(
    (a) => a.id === selectedBillingAddressId.value,
  );
});

const addressToEdit = ref<BillingAddress | null>(null);

const onDragEnd = () => {
  drag.value = false;
  paymentMethods.value.forEach((pm, index) => {
    pm.is_default = index === 0;
    pm.rank = index + 1;
  });
  console.log("Updated order:", paymentMethods.value);
};

const openPaymentModal = (view: "payment" | "billing" = "payment") => {
  modalView.value = view;
  isPaymentModalOpen.value = true;
};

const openAddAddressModal = () => {
  addressToEdit.value = null;
  openPaymentModal("billing");
};

const openEditAddressModal = (address: BillingAddress) => {
  addressToEdit.value = { ...address };
  openPaymentModal("billing");
};

const closePaymentModal = () => {
  isPaymentModalOpen.value = false;
  addressToEdit.value = null;
};

const handleAddPaymentMethod = (newPm: PaymentMethod) => {
  newPm.is_default = paymentMethods.value.length === 0;
  newPm.rank = paymentMethods.value.length + 1;
  paymentMethods.value.push(newPm);
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
      ...(address as Omit<BillingAddress, "id">),
      id: `ba_${Date.now()}`,
    };
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
  closePaymentModal();
};

const handleUpdateSelectedAddress = (id: string) => {
  selectedBillingAddressId.value = id;
};
</script>

<template>
  <Content :is-ready="true">
    <div class="space-y-8">
      <div
        class="rounded-xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_grey] transition-all"
      >
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-lg font-semibold leading-6">Payment Methods</h3>
            <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Drag to reorder. The top item becomes default.
            </p>
          </div>

          <button
            @click="openPaymentModal('payment')"
            class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 dark:bg-blue-700/80 shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none"
            :class="{
              'hover:translate-x-[2px] hover:translate-y-[2px] ': true,
            }"
          >
            <Plus class="w-4 h-4" />
            <span class="whitespace-nowrap">Add Method</span>
          </button>
        </div>

        <div class="flow-root">
          <client-only>
            <draggable
              v-model="paymentMethods"
              tag="ul"
              role="list"
              class="space-y-4"
              item-key="id"
              :animation="200"
              ghost-class="ghost"
              drag-class="drag"
              chosen-class="chosen"
              handle=".drag-handle"
              @start="drag = true"
              @end="onDragEnd"
            >
              <template #item="{ element: pm }">
                <li
                  class="relative flex items-center justify-between px-5 py-4 border border-[var(--text-color)] rounded-md bg-transparent text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)] hover:bg-gray-200 dark:hover:bg-gray-800/50"
                >
                  <div class="flex items-center flex-1 min-w-0">
                    <div
                      class="drag-handle mr-3 cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical class="h-5 w-5 opacity-70" />
                    </div>

                    <CreditCard class="h-6 w-6 opacity-80" />

                    <div class="ml-4 flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-medium">
                          {{ pm.card?.network }}
                        </p>
                        <span class="text-sm opacity-70">
                          •••• {{ pm.card?.masked_card_number?.slice(-4) }}
                        </span>
                      </div>
                      <p class="text-xs opacity-60 mt-0.5">
                        Expires {{ pm.card?.expiry_month }}/{{
                          pm.card?.expiry_year
                        }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 ml-4">
                    <span
                      v-if="pm.is_default"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-[var(--text-color)]"
                    >
                      Default
                    </span>
                    <button
                      class="inline-flex items-center gap-1 rounded-md border-l border-t border-white px-2 py-1 text-xs shadow-[inset_-1px_-1px_0_var(--text-color)] hover:shadow-[inset_-2px_-2px_0_var(--text-color)] transition-all focus:outline-none hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      Edit
                    </button>
                    <button
                      class="inline-flex items-center gap-1 rounded-md border-l border-t border-white px-2 py-1 text-xs text-red-600 dark:text-red-400 shadow-[inset_-1px_-1px_0_var(--text-color)] hover:shadow-[inset_-2px_-2px_0_var(--text-color)] transition-all focus:outline-none hover:translate-x-[1px] hover:translate-y-[1px]"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              </template>
            </draggable>

            <template #fallback>
              <p class="text-sm opacity-70 text-center py-6">
                Loading payment methods...
              </p>
            </template>
          </client-only>
        </div>
      </div>

      <!-- Billing Address Card -->
      <div
        class="rounded-xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_grey] transition-all"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold leading-6">Billing Address</h3>
            <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              Your default address for all invoices.
            </p>
          </div>
          <button
            @click="isBillingModalOpen = true"
            class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 dark:bg-gray-700/80 shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none"
            :class="{
              'hover:translate-x-[2px] hover:translate-y-[2px] ': true,
            }"
          >
            Change
          </button>
        </div>

        <div
          v-if="selectedBillingAddress"
          class="mt-6 border-t border-[var(--text-color)] pt-6 text-sm"
        >
          <p class="font-medium">{{ selectedBillingAddress.address1 }}</p>
          <p v-if="selectedBillingAddress.address2">
            {{ selectedBillingAddress.address2 }}
          </p>
          <p>
            {{ selectedBillingAddress.city }}, {{ selectedBillingAddress.state }}
            {{ selectedBillingAddress.zip }}
          </p>
          <p>{{ selectedBillingAddress.country }}</p>
        </div>

        <div v-else class="mt-6 border-t border-[var(--text-color)] pt-6">
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
            No default billing address selected.
          </p>
        </div>
      </div>
    </div>

    <AddPaymentMethodModal
      :is-open="isPaymentModalOpen"
      :initial-view="modalView"
      :billing-addresses="billingAddresses"
      :selected-billing-address-id="selectedBillingAddressId"
      :editing-address="addressToEdit"
      @close="closePaymentModal"
      @add-payment-method="handleAddPaymentMethod"
      @save-billing-address="handleSaveBillingAddress"
      @update:selectedAddress="handleUpdateSelectedAddress"
      @delete-billing-address="handleDeleteBillingAddress"
    />

    <BillingAddressModal
      :is-open="isBillingModalOpen"
      :billing-addresses="billingAddresses"
      :selected-billing-address-id="selectedBillingAddressId"
      @close="isBillingModalOpen = false"
      @add-address="openAddAddressModal"
      @edit-address="openEditAddressModal"
      @update:selectedAddress="handleUpdateSelectedAddress"
    />
  </Content>
</template>

<style scoped>
.ghost {
  opacity: 0.5;
  background-color: var(--bg-color);
  border: 2px dashed var(--text-color);
}
.drag {
  transform: translate(2px, 2px);
}
.chosen {
  cursor: grabbing;
}
</style>
