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
import FormInput from "~/components/FormInput.vue";
import ActionDropdown from "~/components/common/ActionDropdown.vue";

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
  }
);

const selectedAddress = computed(() => {
  return props.billingAddresses.find(
    (a) => a.id === props.selectedBillingAddressId
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
    "$1XXXXXX$2"
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
      isLoading.value = false;
      errorMessage.value =
        "The payment method may have been added successfully. Try refreshing and checking your payment method.";
      return;
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
      error.value.message || error.message || "An unexpected error occurred.";
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
    class="fixed inset-0 z-50 flex items-center justify-center bg-(--overlay-color)/50"
    @click.self="closeModal"
  >
    <div class="box-modal p-0 max-w-lg">
      <button
        class="absolute top-4 right-4 text-(--text-color) opacity-70 hover:opacity-100 transition-opacity z-10"
        @click="closeModal"
      >
        <X class="w-6 h-6" />
      </button>

      <!-- Success View -->
      <div
        v-if="isSuccess && savedPaymentMethod"
        class="max-h-[80vh] overflow-auto text-center flex flex-col gap-6"
      >
        <div class="flex justify-center pt-2">
          <div
            class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
          >
            <CheckCircle class="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div>
          <h3 class="text-xl font-bold mb-2">Payment Method Added</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Your new payment method has been added successfully.
          </p>
        </div>

        <div
          class="text-left p-5 border border-(--border-color) rounded-lg bg-gray-50 dark:bg-gray-800/30"
        >
          <div
            class="font-semibold text-base border-b border-(--border-color) pb-3"
          >
            Card Details
          </div>
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
        <button class="button-box w-full justify-center" @click="closeModal">
          Done
        </button>
      </div>

      <!-- Payment Method Form -->
      <div
        v-else
        class="max-h-[80vh] overflow-auto flex flex-col gap-6 p-8 mb-2"
      >
        <div>
          <h3 class="text-xl font-bold">
            {{ isEditMode ? "Edit" : "Add New" }} Payment Method
          </h3>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Card Number -->
          <FormInput
            id="card_number"
            v-model="newCard.card_number"
            label="Card Number"
            placeholder="Card Number"
            required
            :disabled="isEditMode"
            :icon="CreditCard"
          />

          <div class="flex gap-4">
            <!-- Expiry Date -->
            <div class="flex-1">
              <label
                class="block text-sm font-medium text-(--text-color) opacity-90 mb-1.5"
              >
                Expiry Date
              </label>
              <div class="flex gap-2">
                <FormInput
                  id="expiry_date_month"
                  v-model="newCard.expiry_month"
                  placeholder="MM"
                  required
                  :disabled="isEditMode"
                  class="w-full"
                />
                <FormInput
                  id="expiry_date_year"
                  v-model="newCard.expiry_year"
                  placeholder="YYYY"
                  required
                  :disabled="isEditMode"
                  class="w-full"
                />
              </div>
            </div>
            <!-- CVC -->
            <div class="w-1/3">
              <FormInput
                id="cvc"
                v-model="newCard.cvc"
                label="CVC"
                placeholder="CVC"
                required
                :disabled="isEditMode"
                :icon="Lock"
              />
            </div>
          </div>

          <!-- Card Holder Name -->
          <FormInput
            id="card_holder_name"
            v-model="newCard.card_holder_name"
            label="Card Holder Name"
            placeholder="Card Holder Name"
            required
            :disabled="isEditMode"
            :icon="User"
          />

          <!-- Custom Name -->
          <FormInput
            id="custom_name"
            v-model="newCard.custom_name"
            label="Custom Name (Optional)"
            placeholder="Custom Name (e.g. Personal Card)"
            :icon="Pencil"
          />

          <!-- Currency -->
          <FormInput
            v-if="!isEditMode"
            id="currency"
            model-value="IDR"
            label="Currency"
            placeholder="Currency"
            disabled
            :icon="DollarSign"
            class="bg-gray-100 dark:bg-gray-800/30"
          />

          <!-- Billing Address Dropdown -->
          <div v-if="!isEditMode" class="pt-2">
            <label
              class="block text-sm font-medium text-(--text-color) opacity-90 mb-1.5"
            >
              Billing Address
            </label>
            <ActionDropdown
              :is-open="isDropdownOpen"
              full-width
              dropdown-class="w-full"
              @toggle="isDropdownOpen = !isDropdownOpen"
              @close="isDropdownOpen = false"
            >
              <template #trigger>
                <button
                  class="w-full flex items-center justify-between text-left px-4 py-3 bg-transparent border border-(--border-color) rounded-lg focus:outline-none hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  type="button"
                >
                  <span v-if="selectedAddress" class="truncate mr-2">
                    {{ selectedAddress.firstName }}
                    {{ selectedAddress.lastName }} -
                    {{ selectedAddress.address }}, {{ selectedAddress.city }}
                  </span>
                  <span v-else class="opacity-70">Select an address</span>
                  <ChevronDown
                    class="w-5 h-5 transition-transform shrink-0"
                    :class="{ 'rotate-180': isDropdownOpen }"
                  />
                </button>
              </template>

              <div class="max-h-60 overflow-y-auto">
                <ul>
                  <li
                    v-for="address in billingAddresses"
                    :key="address.id"
                    class="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-b border-(--border-color) last:border-0"
                    @click="selectAddress(address.id)"
                  >
                    {{ address.firstName }} {{ address.lastName }} -
                    {{ address.address }}, {{ address.city }}
                  </li>
                  <li>
                    <button
                      class="w-full text-left px-4 py-3 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      type="button"
                      @click="goToAddAddress"
                    >
                      <Plus class="w-4 h-4" />
                      Add New Address
                    </button>
                  </li>
                </ul>
              </div>
            </ActionDropdown>
          </div>

          <!-- Set as default checkbox -->
          <div class="flex items-center pt-2">
            <input
              id="default-checkbox"
              v-model="isDefault"
              type="checkbox"
              class="w-4 h-4 rounded bg-transparent border-(--border-color) text-blue-600 focus:ring-blue-500"
            />
            <label
              for="default-checkbox"
              class="ml-3 text-sm font-medium text-(--text-color)"
              >Set as default payment method</label
            >
          </div>

          <div class="min-h-6">
            <div
              v-if="errorMessage"
              class="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded-lg"
            >
              {{ errorMessage }}
            </div>
          </div>

          <div
            class="flex justify-end gap-3 pt-2 border-t border-(--border-color)"
          >
            <button
              class="button-box verbose"
              type="button"
              @click="closeModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isLoading"
              class="button-box hover:translate-x-0.5 hover:translate-y-0.5"
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
