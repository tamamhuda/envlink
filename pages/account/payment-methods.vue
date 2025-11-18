<script setup lang="ts">
import {
  computed,
  definePageMeta,
  onMounted,
  ref,
  usePaymentMethodStore,
  watch,
} from "#imports";
import Content from "~/components/Content.vue";
import AddPaymentMethodModal from "~/components/AddPaymentMethodModal.vue";
import BillingAddressModal from "~/components/BillingAddressModal.vue";
import BillingAddressFormModal from "~/components/BillingAddressFormModal.vue";
import PaymentMethodsList from "~/components/PaymentMethodsList.vue";
import BillingAddressDisplay from "~/components/BillingAddressDisplay.vue";
import { Plus } from "lucide-vue-next";
import { cloneDeep } from "lodash";
import type { PaymentMethod } from "~/client";

definePageMeta({ layout: "account" });

const isPaymentFormModalOpen = ref(false);
const paymentMethodToEdit = ref<PaymentMethod | null>(null);
const isBillingModalOpen = ref(false);
const isBillingFormModalOpen = ref(false);
const billingAddresses = ref<any[]>([
  {
    id: "ba_1",
    first_name: "John",
    last_name: "Doe",
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

const addressToEdit = ref<any | null>(null);

const pmStore = usePaymentMethodStore();

const paymntMethods = computed(() => pmStore.paymentMethods);

const localPaymentMethods = ref<PaymentMethod[]>([]);

watch(
  paymntMethods.value,
  (newMethods) => {
    localPaymentMethods.value = cloneDeep(newMethods);
  },
  { deep: true },
);

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
  await pmStore.initializedPaymentMethods();
  if (pmStore.initialized) {
    localPaymentMethods.value = cloneDeep(paymntMethods.value);
  }
});

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

const openEditAddressModal = (address: any) => {
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

const handleSaveBillingAddress = (address: any | Omit<any, "id">) => {
  if ("id" in address && address.id) {
    const index = billingAddresses.value.findIndex((a) => a.id === address.id);
    if (index !== -1) {
      billingAddresses.value[index] = address as any;
    }
  } else {
    const newAddress: any = {
      ...address,
      id: `ba_${Date.now()}`,
    } as any;
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
  selectedBillingAddressId.value = id;
};
</script>

<template>
  <Content :is-ready="true">
    <div class="space-y-8">
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
            <span class="whitespace-nowrap">Add Method</span>
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

      <BillingAddressDisplay
        :address="selectedBillingAddress"
        @change="isBillingModalOpen = true"
      />
    </div>

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
:deep(.payment-methods-container) {
  position: relative;
}

:deep(.payment-method-card) {
  position: relative;
  z-index: 1;
}

:deep(.divider-container) {
  position: relative;
  z-index: 0;
  pointer-events: none;
}

:deep(.ghost) {
  opacity: 0.5;
  background-color: var(--bg-color);
  border: 2px dashed var(--text-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.ghost .divider-container) {
  display: none;
}

:deep(.drag .divider-container),
:deep(.drag .default) {
  display: none;
}

:deep(.chosen) {
  cursor: grabbing;
}
</style>
