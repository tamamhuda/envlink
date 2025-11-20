<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import {
  CreditCard,
  X,
  User,
  Lock,
  ChevronDown,
  Plus,
  DollarSign,
  Pencil,
  Loader2,
  CheckCircle,
} from "lucide-vue-next";

import { useNuxtApp } from "#app";
import { useAuthStore, usePaymentMethodApi } from "#imports";
import type { BillingAddress, PaymentMethod } from "~/client";

const xendit = useNuxtApp().$config.public.xendit;
const paymentMethod = usePaymentMethodApi();

const user = useAuthStore().user;

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  editingPaymentMethod: {
    type: Object as () => PaymentMethod | null,
    default: null,
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
  "add-payment-method",
  "update-payment-method",
  "update:selectedAddress",
  "add-new-address",
]);

const isEditMode = computed(() => !!props.editingPaymentMethod);

declare const Xendit: any;

onMounted(() => {
  try {
    Xendit.setPublishableKey(xendit.publicKey);
  } catch (error) {
    console.error("Xendit SDK not available:", error);
  }
});

const errorMessage = ref<string | null>(null);
const isDropdownOpen = ref(false);
const isDefault = ref(false);
const isSuccess = ref(false);
const isLoading = ref(false);
const savedPaymentMethod = ref<{
  maskedCardNumber: string;
  cardHolder: string;
  cardType: string;
} | null>(null);

const defaultCard = {
  card_holder_name: "John Doe",
  card_number: "4000000000001091",
  expiry_month: "12",
  expiry_year: "2030",
  cvc: "123",
  custom_name: "Test Card",
};

const newCard = ref({ ...defaultCard });

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      isDropdownOpen.value = false;
      errorMessage.value = null;
      isSuccess.value = false;
      savedPaymentMethod.value = null;

      if (isEditMode.value && props.editingPaymentMethod) {
        const pm = props.editingPaymentMethod;
        newCard.value = {
          card_holder_name: pm.card?.cardHolderName || "",
          card_number: `•••• •••• •••• ${pm.card?.maskedCardNumber?.slice(-4)}`,
          expiry_month: pm.card?.expiryMonth || "",
          expiry_year: pm.card?.expiryYear?.toString() || "",
          cvc: "***",
          custom_name: pm.customName || "",
        };
        isDefault.value = pm.isDefault;
      } else {
        newCard.value = { ...defaultCard };
        isDefault.value = false;
      }
    }
  },
);

const selectedAddress = computed(() => {
  return props.billingAddresses.find(
    (a) => a.id === props.selectedBillingAddressId,
  );
});

const closeModal = () => {
  emit("close");
};

const { validatePaymentMethod, error: validationError } =
  paymentMethod.validate();

const {
  getPaymentMethodById,
  error: paymentMethodsError,
  response,
} = paymentMethod.getById();

const createPaymentMethod = async () => {
  if (!user || !selectedAddress.value) return;

  errorMessage.value = null;
  isLoading.value = true;
  const cardNumber = newCard.value.card_number;
  const cardType = cardNumber.startsWith("4")
    ? "CREDIT"
    : cardNumber.startsWith("5")
      ? "CREDIT"
      : "DEBIT";

  const maskedCardNumber = cardNumber.replace(
    /(\d{6})\d+(\d{4})/,
    "$1XXXXXX$2",
  );

  try {
    await validatePaymentMethod({
      type: "CARD",
      card: {
        cardType: cardType,
        maskedCardNumber: maskedCardNumber,
        expiryMonth: newCard.value.expiry_month,
        expiryYear: newCard.value.expiry_year,
      },
    });

    if (validationError.value) {
      throw validationError;
    }

    const billing_information = {
      country: selectedAddress.value.country,
      province_state: selectedAddress.value.state,
      postal_code: selectedAddress.value.zip,
      city: selectedAddress.value.city,
      street_line1: selectedAddress.value.address,
      street_line2: selectedAddress.value.address2,
    };

    const reqData = {
      type: "CARD",
      customer_id: user.customerId,
      reusability: "MULTIPLE_USE",
      card: {
        currency: "IDR",
        channel_properties: {
          skip_three_d_secure: true,
        },
        billing_information,
        card_information: {
          card_number: newCard.value.card_number,
          expiry_month: newCard.value.expiry_month,
          expiry_year: newCard.value.expiry_year,
          cvv: newCard.value.cvc,
          cardholder_name: newCard.value.card_holder_name,
          cardholder_email: "example@example.com",
          cardholder_phone_number: "+6281234567890",
        },
      },
      metadata: {
        default: isDefault.value,
        custom_name: newCard.value.custom_name,
      },
    };

    const resp: any = await new Promise((resolve, reject) => {
      Xendit.payment.createPaymentMethod(reqData, (err: any, res: any) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });

    await getPaymentMethodById(resp.id);
    let retryCount = 0;
    while (paymentMethodsError.value && retryCount < 3) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await getPaymentMethodById(resp.id);
      retryCount++;
    }

    if (paymentMethodsError.value || !response.value) {
      throw "An error occurred";
    }

    const paymentMethod = response.value.data;

    emit("add-payment-method", paymentMethod);
    savedPaymentMethod.value = {
      maskedCardNumber: "•••• •••• •••• " + cardNumber.slice(-4),
      cardHolder: paymentMethod.card?.cardHolderName || "",
      cardType: paymentMethod.card?.network || "",
    };
    isSuccess.value = true;
    isLoading.value = false;
  } catch (error: any) {
    errorMessage.value =
      error.value.data.message ||
      error.message ||
      "An unexpected error occurred.";
    console.error("Payment Method Error:", error.value.data);
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (isEditMode.value) {
    if (!props.editingPaymentMethod) return;
    emit("update-payment-method", {
      ...props.editingPaymentMethod,
      custom_name: newCard.value.custom_name,
      is_default: isDefault.value,
    });
    closeModal();
  } else {
    await createPaymentMethod();
  }
};

const selectAddress = (id: string) => {
  emit("update:selectedAddress", id);
  isDropdownOpen.value = false;
};

const goToAddAddress = () => {
  isDropdownOpen.value = false;
  emit("add-new-address");
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

      <!-- Success View -->
      <div
        v-if="isSuccess && savedPaymentMethod"
        class="max-h-[80vh] overflow-auto text-center"
      >
        <div class="flex justify-center mb-4 pt-5">
          <CheckCircle class="w-16 h-16 text-green-500" />
        </div>
        <h3 class="text-lg font-semibold leading-6 mb-2">
          Payment Method Added
        </h3>
        <p class="text-sm text-[var(--text-color)]/80 mb-6">
          Your new payment method has been added successfully.
        </p>
        <div
          class="text-left p-5 border border-[var(--text-color)] rounded-lg shadow-[2px_2px_0_var(--text-color)] mb-8 bg-gray-100 dark:bg-gray-800/30"
        >
          <div class="font-semibold text-base border-b pb-3">Card Details</div>
          <div class="text-sm space-y-4 mt-4">
            <div class="flex justify-between">
              <span class="font-medium opacity-80">Card Holder:</span>
              <span>{{ savedPaymentMethod.cardHolder }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium opacity-80">Card Number:</span>
              <span>{{ savedPaymentMethod.maskedCardNumber }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium opacity-80">Network:</span>
              <span class="uppercase">{{ savedPaymentMethod.cardType }}</span>
            </div>
          </div>
        </div>
        <button
          class="w-full inline-flex items-center justify-center gap-2 rounded-lg border-l border-t border-white px-4 py-3 bg-blue-700/80 text-white text-base font-semibold shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all"
          @click="closeModal"
        >
          Done
        </button>
      </div>

      <!-- Payment Method Form -->
      <div v-else class="max-h-[80vh] overflow-auto">
        <h3 class="text-lg font-semibold leading-6 mb-6">
          {{ isEditMode ? "Edit" : "Add New" }} Payment Method
        </h3>
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Card Number -->
          <div class="relative group">
            <label for="card_number" class="sr-only">Card Number</label>
            <CreditCard
              class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50 transition-opacity group-focus-within:opacity-100"
            />
            <input
              id="card_number"
              v-model="newCard.card_number"
              type="text"
              required
              :disabled="isEditMode"
              class="w-full pl-10 pr-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb] disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Card Number"
            />
          </div>

          <div class="flex gap-4">
            <!-- Expiry Date -->
            <div class="flex-1">
              <label for="expiry_date_month" class="sr-only">Expiry Date</label>
              <div class="flex gap-2">
                <input
                  id="expiry_date_month"
                  v-model="newCard.expiry_month"
                  type="text"
                  required
                  :disabled="isEditMode"
                  class="w-full px-3 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb] disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="MM"
                />
                <input
                  id="expiry_date_year"
                  v-model="newCard.expiry_year"
                  type="text"
                  required
                  :disabled="isEditMode"
                  class="w-full px-3 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb] disabled:opacity-50 disabled:cursor-not-allowed"
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
                id="cvc"
                v-model="newCard.cvc"
                type="text"
                required
                :disabled="isEditMode"
                class="w-full pl-10 pr-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb] disabled:opacity-50 disabled:cursor-not-allowed"
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
              id="card_holder_name"
              v-model="newCard.card_holder_name"
              type="text"
              required
              :disabled="isEditMode"
              class="w-full pl-10 pr-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb] disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Card Holder Name"
            />
          </div>

          <!-- Custom Name -->
          <div class="relative group">
            <label for="custom_name" class="sr-only"
              >Custom Name (Optional)</label
            >
            <Pencil
              class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50 transition-opacity group-focus-within:opacity-100"
            />
            <input
              id="custom_name"
              v-model="newCard.custom_name"
              type="text"
              class="w-full pl-10 pr-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
              placeholder="Custom Name (e.g. Personal Card)"
            />
          </div>

          <!-- Currency -->
          <div v-if="!isEditMode" class="relative group">
            <label for="currency" class="sr-only">Currency</label>
            <DollarSign
              class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50"
            />
            <input
              id="currency"
              type="text"
              value="IDR"
              disabled
              class="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700/30 border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)]"
              placeholder="Currency"
            />
          </div>

          <!-- Billing Address Dropdown -->
          <div v-if="!isEditMode" class="pt-4">
            <label class="text-sm font-medium mb-2 block"
              >Billing Address</label
            >
            <div class="relative">
              <button
                class="w-full flex items-center justify-between text-left px-4 py-3 bg-transparent border border-[var(--text-color)] rounded-lg focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb]"
                type="button"
                @click="isDropdownOpen = !isDropdownOpen"
              >
                <span v-if="selectedAddress">
                  {{ selectedAddress.firstName }}
                  {{ selectedAddress.lastName }} -
                  {{ selectedAddress.address }}, {{ selectedAddress.city }}
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
                    class="px-4 py-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800/50"
                    @click="selectAddress(address.id)"
                  >
                    {{ address.firstName }} {{ address.lastName }} -
                    {{ address.address }}, {{ address.city }}
                  </li>
                  <li>
                    <button
                      class="w-full text-left px-4 py-3 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-800/50"
                      type="button"
                      @click="goToAddAddress"
                    >
                      <Plus class="w-4 h-4" />
                      Add New Address
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Set as default checkbox -->
          <div class="flex items-center pt-5">
            <input
              id="default-checkbox"
              v-model="isDefault"
              type="checkbox"
              class="w-4 h-4 rounded bg-transparent border-[var(--text-color)] text-blue-600 focus:ring-blue-500"
            />
            <label
              for="default-checkbox"
              class="ml-3 text-sm font-medium text-[var(--text-color)]"
              >Set as default payment method</label
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

          <div class="flex justify-end gap-4 pt-6">
            <button
              class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 shadow-[inset_-2px_-2px_0_var(--text-color)] hover:shadow-[inset_-3px_-3px_0_var(--text-color)] transition-all focus:outline-none"
              type="button"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="inline-flex items-center justify-center gap-2 rounded-lg border-l border-t border-white px-4 py-3 bg-blue-700/80 text-white text-base font-semibold shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              <span>{{
                isLoading
                  ? "Saving..."
                  : isEditMode
                    ? "Save Changes"
                    : "Save Payment Method"
              }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
