<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { components } from "~/types/api.d";
import { CreditCard, X, User, Lock, ChevronDown, Plus } from "lucide-vue-next";
import CountryFlag from "vue-country-flag-next";
import { getNames, getCode } from "country-list";

type PaymentMethod =
  components["schemas"]["AllPaymentMethodsResponse"]["data"][number];
type BillingAddress = {
  id: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
};
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  initialView: {
    type: String,
    default: "payment", // 'payment' or 'billing'
  },
  billingAddresses: {
    type: Array as () => BillingAddress[],
    default: () => [],
  },
  selectedBillingAddressId: {
    type: String,
    default: null,
  },
  editingAddress: {
    type: Object as () => BillingAddress | null,
    default: null,
  },
});
const emit = defineEmits([
  "close",
  "add-payment-method",
  "save-billing-address",
  "update:selectedAddress",
  "delete-billing-address",
]);
const currentView = ref(props.initialView);
const isDropdownOpen = ref(false);
const isCountryDropdownOpen = ref(false);
const searchCountryQuery = ref("");
const countries = getNames();
const newCard = ref({
  card_holder_name: "",
  card_number: "",
  expiry_month: "",
  expiry_year: "",
  cvc: "",
});
const billingAddress = ref({
  id: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
});
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      currentView.value = props.initialView;
      isDropdownOpen.value = false;
      if (props.editingAddress && currentView.value === "billing") {
        billingAddress.value = { ...props.editingAddress };
      } else {
        billingAddress.value = {
          id: "",
          address1: "",
          address2: "",
          city: "",
          state: "",
          zip: "",
          country: "",
        };
      }
    }
  },
);
const filteredCountries = computed(() => {
  return countries.filter((country) =>
    country.toLowerCase().includes(searchCountryQuery.value.toLowerCase()),
  );
});
const selectedAddress = computed(() => {
  return props.billingAddresses.find(
    (a) => a.id === props.selectedBillingAddressId,
  );
});
const selectedCountryCode = computed(() => {
  return getCode(billingAddress.value.country);
});
const closeModal = () => {
  emit("close");
  // Reset forms
  newCard.value = {
    card_holder_name: "",
    card_number: "",
    expiry_month: "",
    expiry_year: "",
    cvc: "",
  };
};
const addPaymentMethod = () => {
  if (
    !newCard.value.card_holder_name ||
    !newCard.value.card_number ||
    !newCard.value.expiry_month ||
    !newCard.value.expiry_year
  ) {
    // Simple validation
    return;
  }
  const newPm: PaymentMethod = {
    id: `pm_${Date.now()}`,
    type: "CARD",
    is_default: false, // Parent will handle this
    card: {
      network: "Visa", // Mock network
      masked_card_number: `**** **** **** ${newCard.value.card_number.slice(
        -4,
      )}`,
      expiry_month: newCard.value.expiry_month,
      expiry_year: newCard.value.expiry_year,
      card_holder_name: newCard.value.card_holder_name,
      card_type: "credit",
      issuer: "New Bank",
    },
    user_id: "user_123",
    external_id: `ext_pm_${Date.now()}`,
    reusability: "REUSABLE",
    country: "US",
    currency: "USD",
    status: "ACTIVE",
    channel_code: "VISA",
    provider: "stripe",
    failure_code: null,
    custom_name: "New Card",
    direct_debit: null,
    ewallet: null,
    recurring_expiry: null,
    recurring_frequency: null,
    rank: 0, // Parent will handle this
    metadata: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  emit("add-payment-method", newPm);
  closeModal();
};
const saveBillingAddress = () => {
  // Simple validation
  if (
    !billingAddress.value.address1 ||
    !billingAddress.value.city ||
    !billingAddress.value.zip ||
    !billingAddress.value.country
  ) {
    return;
  }
  emit("save-billing-address", { ...billingAddress.value });
  if (props.initialView === "billing") {
    closeModal();
  } else {
    currentView.value = "payment";
  }
};
const handleBillingCancel = () => {
  if (props.initialView === "billing") {
    closeModal();
  } else {
    currentView.value = "payment";
  }
};
const selectAddress = (id: string) => {
  emit("update:selectedAddress", id);
  isDropdownOpen.value = false;
};
const selectCountry = (country: string) => {
  billingAddress.value.country = country;
  isCountryDropdownOpen.value = false;
  searchCountryQuery.value = "";
};
const goToAddAddress = () => {
  isDropdownOpen.value = false;
  currentView.value = "billing";
};

const handleDeleteAddress = () => {
  if (props.editingAddress) {
    emit("delete-billing-address", props.editingAddress.id);
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    @click.self="closeModal"
  >
    <div
      class="relative w-full max-w-lg rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
    >
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-[var(--text-color)] opacity-70 hover:opacity-100"
      >
        <X class="w-6 h-6" />
      </button>

      <!-- Payment Method Form -->
      <div v-if="currentView === 'payment'">
        <h3 class="text-lg font-semibold leading-6 mb-6">
          Add New Payment Method
        </h3>
        <form @submit.prevent="addPaymentMethod" class="space-y-4">
          <!-- Card Number -->
          <div class="relative group">
            <label for="card_number" class="sr-only">Card Number</label>
            <CreditCard
              class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50 transition-opacity group-focus-within:opacity-100"
            />
            <input
              v-model="newCard.card_number"
              type="text"
              id="card_number"
              required
              class="w-full pl-10 pr-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
              placeholder="Card Number"
            />
          </div>

          <div class="flex gap-4">
            <!-- Expiry Date -->
            <div class="flex-1">
              <label for="expiry_date_month" class="sr-only">Expiry Date</label>
              <div class="flex gap-2">
                <input
                  v-model="newCard.expiry_month"
                  type="text"
                  id="expiry_date_month"
                  required
                  class="w-full px-3 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
                  placeholder="MM"
                />
                <input
                  v-model="newCard.expiry_year"
                  type="text"
                  id="expiry_date_year"
                  required
                  class="w-full px-3 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
                  placeholder="YYYY"
                />
              </div>
            </div>
            <!-- CVC -->
            <div class="relative group w-1/3">
              <label for="cvc" class="sr-only">CVC</label>
              <Lock
                class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50 transition-opacity group-focus-within:opacity-100"
              />
              <input
                v-model="newCard.cvc"
                type="text"
                id="cvc"
                required
                class="w-full pl-10 pr-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
                placeholder="CVC"
              />
            </div>
          </div>

          <!-- Card Holder Name -->
          <div class="relative group">
            <label for="card_holder_name" class="sr-only"
              >Card Holder Name</label
            >
            <User
              class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50 transition-opacity group-focus-within:opacity-100"
            />
            <input
              v-model="newCard.card_holder_name"
              type="text"
              id="card_holder_name"
              required
              class="w-full pl-10 pr-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
              placeholder="Card Holder Name"
            />
          </div>

          <!-- Billing Address Dropdown -->
          <div class="pt-4">
            <label class="text-sm font-medium mb-2 block"
              >Billing Address</label
            >
            <div class="relative">
              <button
                type="button"
                @click="isDropdownOpen = !isDropdownOpen"
                class="w-full flex items-center justify-between text-left px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
              >
                <span v-if="selectedAddress">
                  {{ selectedAddress.address1 }}, {{ selectedAddress.city }}
                </span>
                <span v-else class="opacity-70">Select an address</span>
                <ChevronDown
                  class="w-5 h-5 transition-transform"
                  :class="{ 'rotate-180': isDropdownOpen }"
                />
              </button>
              <div
                v-if="isDropdownOpen"
                class="absolute z-10 mt-2 w-full bg-[var(--bg-color)] border border-[var(--text-color)] rounded-lg shadow-[2px_2px_0_var(--text-color)] overflow-hidden"
              >
                <ul>
                  <li
                    v-for="address in billingAddresses"
                    :key="address.id"
                    @click="selectAddress(address.id)"
                    class="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800/50"
                  >
                    {{ address.address1 }}, {{ address.city }}
                  </li>
                  <li>
                    <button
                      type="button"
                      @click="goToAddAddress"
                      class="w-full text-left px-4 py-3 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-800/50"
                    >
                      <Plus class="w-4 h-4" />
                      Add New Address
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-6">
            <button
              type="button"
              @click="closeModal"
              class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 shadow-[inset_-2px_-2px_0_var(--text-color)] hover:shadow-[inset_-3px_-3px_0_var(--text-color)] transition-all focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-3 bg-blue-700/80 text-white text-base font-semibold shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all"
            >
              Save Payment Method
            </button>
          </div>
        </form>
      </div>

      <!-- Billing Address Form -->
      <div v-if="currentView === 'billing'">
        <h3 class="text-lg font-semibold leading-6 mb-6">
          {{ editingAddress ? "Edit" : "Add" }} Billing Address
        </h3>
        <form @submit.prevent="saveBillingAddress" class="space-y-4">
          <!-- Form fields for billing address -->
          <input
            v-model="billingAddress.address1"
            type="text"
            placeholder="Address Line 1"
            required
            class="w-full px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
          />
          <input
            v-model="billingAddress.address2"
            type="text"
            placeholder="Address Line 2 (Optional)"
            class="w-full px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
          />
          <div class="flex gap-4">
            <input
              v-model="billingAddress.city"
              type="text"
              placeholder="City"
              required
              class="w-full px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
            />
            <input
              v-model="billingAddress.state"
              type="text"
              placeholder="State / Province"
              required
              class="w-full px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
            />
          </div>
          <div class="flex gap-4">
            <input
              v-model="billingAddress.zip"
              type="text"
              placeholder="ZIP / Postal Code"
              required
              class="w-full px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
            />
            <div class="relative w-full">
              <button
                type="button"
                @click="isCountryDropdownOpen = !isCountryDropdownOpen"
                class="w-full flex items-center justify-between text-left px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
              >
                <div class="flex items-center gap-2">
                  <CountryFlag
                    v-if="selectedCountryCode"
                    :country="selectedCountryCode"
                    size="small"
                  />
                  <span v-if="billingAddress.country">
                    {{ billingAddress.country }}
                  </span>
                  <span v-else class="opacity-70">Country</span>
                </div>
                <ChevronDown
                  class="w-5 h-5 transition-transform"
                  :class="{ 'rotate-180': isCountryDropdownOpen }"
                />
              </button>
              <div
                v-if="isCountryDropdownOpen"
                class="absolute z-20 bottom-full mb-2 w-full bg-[var(--bg-color)] border border-[var(--text-color)] rounded-lg shadow-[2px_2px_0_var(--text-color)] overflow-hidden"
              >
                <input
                  v-model="searchCountryQuery"
                  type="text"
                  placeholder="Search country..."
                  class="w-full px-4 py-2 bg-transparent border-b border-[var(--text-color)] focus:outline-none"
                />
                <ul class="max-h-48 overflow-y-auto">
                  <li
                    v-for="country in filteredCountries"
                    :key="country"
                    @click="selectCountry(country)"
                    class="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800/50 flex items-center gap-2"
                  >
                    <CountryFlag
                      :country="getCode(country)"
                      size="small"
                    />
                    <span class="text-sm">{{ country }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center gap-4 pt-6">
            <div>
              <button
                v-if="editingAddress"
                type="button"
                @click="handleDeleteAddress"
                class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 text-red-600 dark:text-red-400 shadow-[inset_-2px_-2px_0_var(--text-color)] hover:shadow-[inset_-3px_-3px_0_var(--text-color)] transition-all focus:outline-none"
              >
                Delete
              </button>
            </div>
            <div class="flex gap-4">
              <button
                type="button"
                @click="handleBillingCancel"
                class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 shadow-[inset_-2px_-2px_0_var(--text-color)] hover:shadow-[inset_-3px_-3px_0_var(--text-color)] transition-all focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-3 bg-blue-700/80 text-white text-base font-semibold shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all"
              >
                Save Address
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
