import { useBillingAddressApi } from "#imports";
import { defineStore } from "pinia";
import type { BillingAddress } from "~/client";

type BillingAddressStoreState = {
  billingAddresses: BillingAddress[];
  initialized: boolean;
};
export const useBillingAddressStore = defineStore("billing-address", {
  state: (): BillingAddressStoreState => ({
    billingAddresses: [],
    initialized: false,
  }),
  actions: {
    setBillingAddress(billingAddress: BillingAddress[]) {
      this.billingAddresses = billingAddress;
    },

    addBillingAddress(billingAddress: BillingAddress) {
      if (billingAddress.isDefault) {
        // Clear all defaults on add, because new record does not exist yet
        this.billingAddresses = this.billingAddresses.map((i) => ({
          ...i,
          isDefault: false,
        }));
      }

      this.billingAddresses.push(billingAddress);
    },

    updateAddress(billingAddress: BillingAddress) {
      if (billingAddress.isDefault) {
        // clear defaults except self
        this.billingAddresses = this.billingAddresses.map((i) =>
          i.id === billingAddress.id
            ? billingAddress
            : { ...i, isDefault: false },
        );
      } else {
        // normal update
        this.billingAddresses = this.billingAddresses.map((i) =>
          i.id === billingAddress.id ? billingAddress : i,
        );
      }
    },
    async initializeBillingAddress() {
      if (this.initialized) return;
      const { getAllBillingAddress } = useBillingAddressApi().getAll();
      await getAllBillingAddress();
      this.initialized = true;
    },
  },
});
