<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { X, ChevronDown } from "lucide-vue-next";
import CountryFlag from "vue-country-flag-next";
import { getNames, getCode } from "country-list";

type BillingAddress = {
  id: string;
  first_name: string;
  last_name: string;
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
  editingAddress: {
    type: Object as () => BillingAddress | null,
    default: null,
  },
});

const emit = defineEmits(["close", "save-billing-address", "delete-billing-address"]);

const isCountryDropdownOpen = ref(false);
const searchCountryQuery = ref("");
const countries = getNames();

const billingAddress = ref<Partial<BillingAddress>>({
  id: "",
  first_name: "",
  last_name: "",
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
      isCountryDropdownOpen.value = false;
      if (props.editingAddress) {
        billingAddress.value = { ...props.editingAddress };
      } else {
        billingAddress.value = {
          id: "",
          first_name: "",
          last_name: "",
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

const selectedCountryCode = computed(() => {
  return billingAddress.value.country ? getCode(billingAddress.value.country) : null;
});

const closeModal = () => {
  emit("close");
};

const saveBillingAddress = () => {
  if (
    !billingAddress.value.first_name ||
    !billingAddress.value.last_name ||
    !billingAddress.value.address1 ||
    !billingAddress.value.city ||
    !billingAddress.value.zip ||
    !billingAddress.value.country
  ) {
    return;
  }
  emit("save-billing-address", { ...billingAddress.value });
  closeModal();
};

const handleBillingCancel = () => {
  closeModal();
};

const selectCountry = (country: string) => {
  billingAddress.value.country = country;
  isCountryDropdownOpen.value = false;
  searchCountryQuery.value = "";
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

      <div>
        <h3 class="text-lg font-semibold leading-6 mb-6">
          {{ editingAddress ? "Edit" : "Add" }} Billing Address
        </h3>
        <form @submit.prevent="saveBillingAddress" class="space-y-4">
          <div class="flex gap-4">
            <input
              v-model="billingAddress.first_name"
              type="text"
              placeholder="First Name"
              required
              class="w-full px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
            />
            <input
              v-model="billingAddress.last_name"
              type="text"
              placeholder="Last Name"
              required
              class="w-full px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
            />
          </div>
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
                    <CountryFlag :country="getCode(country)" size="small" />
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
