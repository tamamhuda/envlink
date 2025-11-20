<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { X, ChevronDown, Loader2 } from "lucide-vue-next";
import CountryFlag from "vue-country-flag-next";
import { getNames, getCode } from "country-list";
import {
  instanceOfErrorResponse,
  type BillingAddress,
  type CreateBillingAddressRequest,
} from "~/client";
import { useBillingAddressApi } from "#imports";
import { isEqual, cloneDeep } from "lodash";

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  editingAddress: {
    type: Object as () => BillingAddress | null,
    default: null,
  },
});

const emit = defineEmits([
  "close",
  "save-billing-address",
  "delete-billing-address",
]);

const isCountryDropdownOpen = ref(false);
const searchCountryQuery = ref("");
const isEditing = ref(false);
const errorMessage = ref<string | null>(null);
const countries = getNames();
const billingAddressApi = useBillingAddressApi();

const {
  createBillingAddress,
  error: createError,
  pending: isCreateLoading,
} = billingAddressApi.create();
const {
  response: updateResponse,
  updateBillingAddress,
  error: updateError,
  pending: isUpdateLoading,
} = billingAddressApi.update();

const selectedBillingAddressId = ref<string | null>(null);

const emptyBilling: Omit<
  BillingAddress,
  "id" | "createdAt" | "updatedAt" | "userId"
> = {
  firstName: "",
  lastName: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  phone: "",
  isDefault: false,
  customName: "",
};

const billingAddress = ref(cloneDeep(emptyBilling));
const initialFormSnapshot = ref(cloneDeep(emptyBilling));

// sync on open
watch(
  () => props.isOpen,
  (val) => {
    if (!val) return;

    isCountryDropdownOpen.value = false;

    if (props.editingAddress) {
      isEditing.value = true;
      selectedBillingAddressId.value = props.editingAddress.id;
      billingAddress.value = cloneDeep({
        ...props.editingAddress,
        // ensure optional field exists
        address2: props.editingAddress.address2 ?? "",
      });
      initialFormSnapshot.value = cloneDeep(billingAddress.value);
    } else {
      isEditing.value = false;
      billingAddress.value = cloneDeep(emptyBilling);
      initialFormSnapshot.value = cloneDeep(emptyBilling);
    }
  },
);

const filteredCountries = computed(() => {
  return countries.filter((country) =>
    country.toLowerCase().includes(searchCountryQuery.value.toLowerCase()),
  );
});

const selectedCountryCode = computed(() => {
  return billingAddress.value.country
    ? getCode(billingAddress.value.country)
    : null;
});

// detect changes
const hasChanges = computed(() => {
  return !isEqual(billingAddress.value, initialFormSnapshot.value);
});

const closeModal = () => emit("close");

const handleCreateBillingAddress = async () => {
  billingAddress.value.address2 =
    billingAddress.value.address2?.trim() === ""
      ? undefined
      : billingAddress.value.address2;

  await createBillingAddress(billingAddress.value);

  if (createError.value && instanceOfErrorResponse(createError.value)) {
    errorMessage.value = createError.value.message || "An error occurred";
    return;
  }
  closeModal();
};

const handleUpdateBillingAddress = async () => {
  if (!selectedBillingAddressId.value) return;

  billingAddress.value.address2 =
    billingAddress.value.address2?.trim() === ""
      ? undefined
      : billingAddress.value.address2;

  await updateBillingAddress(
    selectedBillingAddressId.value,
    billingAddress.value,
  );

  if (updateError.value && instanceOfErrorResponse(updateError.value)) {
    errorMessage.value = updateError.value.message || "An error occurred";
    return;
  }

  if (updateResponse.value) {
    billingAddress.value = cloneDeep(updateResponse.value.data);
    initialFormSnapshot.value = cloneDeep(updateResponse.value.data);
  }

  // closeModal();
};

const saveBillingAddress = async () => {
  if (!hasChanges.value) return;

  if (
    !billingAddress.value.firstName ||
    !billingAddress.value.lastName ||
    !billingAddress.value.address ||
    !billingAddress.value.city ||
    !billingAddress.value.zip ||
    !billingAddress.value.country ||
    !billingAddress.value.phone
  ) {
    return;
  }

  errorMessage.value = null;

  return isEditing.value
    ? await handleUpdateBillingAddress()
    : await handleCreateBillingAddress();
};

const handleBillingCancel = () => closeModal();

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
        class="absolute top-4 right-4 text-[var(--text-color)] opacity-70 hover:opacity-100"
        @click="closeModal"
      >
        <X class="w-6 h-6" />
      </button>

      <div>
        <h3 class="text-lg font-semibold leading-6 mb-6">
          {{ editingAddress ? "Edit" : "Add" }} Billing Address
        </h3>
        <form class="space-y-4" @submit.prevent="saveBillingAddress">
          <div class="flex gap-4">
            <input
              v-model="billingAddress.firstName"
              type="text"
              placeholder="First Name"
              required
              class="w-full px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
            />
            <input
              v-model="billingAddress.lastName"
              type="text"
              placeholder="Last Name"
              required
              class="w-full px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
            />
          </div>
          <!-- Form fields for billing address -->
          <input
            v-model="billingAddress.address"
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
                class="w-full flex items-center justify-between text-left px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
                type="button"
                @click="isCountryDropdownOpen = !isCountryDropdownOpen"
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
                    class="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800/50 flex items-center gap-2"
                    @click="selectCountry(country)"
                  >
                    <CountryFlag :country="getCode(country)" size="small" />
                    <span class="text-sm">{{ country }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <input
            v-model="billingAddress.phone"
            type="text"
            placeholder="Phone Number"
            class="w-full px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
          />

          <input
            v-model="billingAddress.customName"
            type="text"
            placeholder="Custom Name"
            class="w-full px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
          />

          <!-- Set as default checkbox -->
          <div class="flex items-center pt-5">
            <input
              id="default-checkbox"
              v-model="billingAddress.isDefault"
              type="checkbox"
              class="w-4 h-4 rounded bg-transparent border-[var(--text-color)] text-blue-600 focus:ring-blue-500"
            />
            <label
              for="default-checkbox"
              class="ml-3 text-sm font-medium text-[var(--text-color)]"
              >Set as default billing address</label
            >
          </div>

          <div class="min-h-10">
            <div
              v-if="errorMessage"
              class="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded-lg"
            >
              {{ errorMessage }}
            </div>
          </div>

          <div class="flex justify-between items-center gap-4 pt-6">
            <div>
              <button
                v-if="editingAddress"
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 text-red-600 dark:text-red-400 shadow-[inset_-2px_-2px_0_var(--text-color)] hover:shadow-[inset_-3px_-3px_0_var(--text-color)] transition-all focus:outline-none"
                @click="handleDeleteAddress"
              >
                Delete
              </button>
            </div>
            <div class="flex gap-4">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 shadow-[inset_-2px_-2px_0_var(--text-color)] hover:shadow-[inset_-3px_-3px_0_var(--text-color)] transition-all focus:outline-none"
                @click="handleBillingCancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isCreateLoading || isUpdateLoading || !hasChanges"
                class="inline-flex items-center justify-center gap-2 rounded-lg border-l border-t border-white px-4 py-3 bg-blue-700/80 text-white text-base font-semibold shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2
                  v-if="isCreateLoading || isUpdateLoading"
                  class="w-4 h-4 mr-2 animate-spin"
                />
                <span>{{
                  isCreateLoading || isUpdateLoading
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Save Address"
                }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
