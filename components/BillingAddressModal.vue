<script setup lang="ts">
import { ref, computed } from "vue";
import { Plus, X, ChevronDown } from "lucide-vue-next";
import type { BillingAddress } from "~/client";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  billingAddresses: {
    type: Array as () => BillingAddress[],
    default: () => [],
  },
  selectedBillingAddressId: {
    type: String,
    default: null,
  },
});

const emit = defineEmits([
  "close",
  "add-address",
  "edit-address",
  "update:selectedAddress",
]);

const isAddressDropdownOpen = ref(false);

const selectedBillingAddress = computed(() => {
  return props.billingAddresses.find(
    (a) => a.id === props.selectedBillingAddressId,
  );
});

const handleUpdateSelectedAddress = (id: string) => {
  emit("update:selectedAddress", id);
  console.log("Selected Address ID:", id);
  isAddressDropdownOpen.value = false;
};

const handleEditAddress = (address: BillingAddress) => {
  emit("edit-address", address);
};

const handleAddAddress = () => {
  emit("add-address");
};

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
    @click.self="closeModal"
  >
    <div
      class="relative w-full max-w-lg rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
    >
      <button
        class="absolute top-4 right-4 text-[var(--text-color)] opacity-70 hover:opacity-100"
        @click="closeModal"
      >
        <X class="w-6 h-6" />
      </button>

      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-semibold leading-6">Billing Address</h3>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Choose the address you want to use by default in your invoice
            details.
          </p>
        </div>
      </div>

      <div class="mt-6 border-t border-[var(--text-color)] pt-6">
        <div v-if="billingAddresses.length > 0">
          <label class="text-sm font-medium mb-2 block"
            >Billing Address for Invoices</label
          >
          <div class="relative">
            <button
              type="button"
              class="w-full flex items-center justify-between text-left px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
              @click="isAddressDropdownOpen = !isAddressDropdownOpen"
            >
              <span v-if="selectedBillingAddress">
                {{ selectedBillingAddress.customName ?? selectedBillingAddress.firstName + " " + selectedBillingAddress.lastName }} - 
                {{ selectedBillingAddress.address }},
                {{ selectedBillingAddress.city }}
              </span>
              <span v-else class="opacity-70">Select an address</span>
              <ChevronDown
                class="w-5 h-5 transition-transform"
                :class="{ 'rotate-180': isAddressDropdownOpen }"
              />
            </button>
            <div
              v-if="isAddressDropdownOpen"
              class="absolute z-10 mt-2 w-full bg-[var(--bg-color)] border border-[var(--text-color)] rounded-lg shadow-[2px_2px_0_var(--text-color)] overflow-hidden"
            >
              <ul>
                <li
                  v-for="address in billingAddresses"
                  :key="address.id"
                  class="px-4 py-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800/50 flex justify-between items-center"
                  @click="handleUpdateSelectedAddress(address.id)"
                >
                  <span class="text-sm">
                    {{ address.customName ?? address.firstName + " " + address.lastName }} - 
                    {{ address.address }}, {{ address.city }}
                  </span>
                  <div class="flex items-center gap-2">
                    <span
                      v-if="address.isDefault"
                     class="default inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-[var(--text-color)]"
                    >
                      Default
                    </span>
                    <button
                      class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      @click.stop="handleEditAddress(address)"
                    >
                      Edit
                    </button>
                  </div>
                </li>
                <li
                  class="px-4 py-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800/50 flex items-center gap-2 text-blue-600 dark:text-blue-400"
                  @click="handleAddAddress"
                >
                  <Plus class="w-4 h-4" />
                  <span class="text-sm font-medium">Add New Address</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            No billing address on file.
          </p>
          <button
            class="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            @click="handleAddAddress"
          >
            Add one now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
