import { defineStore } from "pinia";
import { cloneDeep, isEqual } from "lodash";

import { usePaymentMethodApi } from "#imports";
import type { PaymentMethod } from "~/client";

type PaymentMethodState = {
  paymentMethods: PaymentMethod[];
  tempPaymentMethods: PaymentMethod[];
  initialized: boolean;
};

export const usePaymentMethodStore = defineStore("payment-methods", {
  state: (): PaymentMethodState => ({
    paymentMethods: [],
    tempPaymentMethods: [],
    initialized: false,
  }),

  actions: {
    async setPaymentMethods(data: PaymentMethod[]) {
      this.paymentMethods = data;
      this.tempPaymentMethods = cloneDeep(data);
    },
    /** Initialize all payment methods from API */
    async initializedPaymentMethods() {
      if (this.initialized) return;
      const { getAllPaymentMethods } = usePaymentMethodApi().getAll();
      await getAllPaymentMethods();
      this.initialized = true;
    },

    syncPaymentMethods(data: PaymentMethod[]) {
      this.paymentMethods = data;
    },

    /** Persist current order to backend */
    async updateAndPersistOrder() {
      const methods = this.paymentMethods;

      methods.forEach((pm, i) => {
        pm.rank = i + 1;
        pm.isDefault = i === 0;
      });

      const hasChanged = !isEqual(
        methods.map(({ id, rank, isDefault }) => ({ id, rank, isDefault })),
        this.tempPaymentMethods.map(({ id, rank, isDefault }) => ({
          id,
          rank,
          isDefault,
        })),
      );

      if (!hasChanged) return;

      const sortPayload = methods.map((pm) => ({
        paymentMethodId: pm.id,
        rank: pm.rank,
      }));

      try {
        const paymentMethods = usePaymentMethodApi();
        const { sortPaymentMethods } = paymentMethods.sort();

        await sortPaymentMethods(sortPayload);
        this.syncTempSnapshot();
      } catch (err) {
        console.error("Failed to update payment methods:", err);
        this.paymentMethods = cloneDeep(this.tempPaymentMethods);
      }
    },

    /** Sync temp snapshot with current state */
    syncTempSnapshot() {
      this.tempPaymentMethods = cloneDeep(this.paymentMethods);
    },

    /** Triggered after drag reorder */
    async onDragEnd() {
      await this.updateAndPersistOrder();
    },

    /** Set payment method as default (move to top) */
    async setDefault(index: number) {
      if (index === 0) return;
      const item = this.paymentMethods.splice(index, 1)[0]!;
      this.paymentMethods.unshift(item);
      await this.updateAndPersistOrder();
    },

    /** Move payment method one position up */
    async moveUp(index: number) {
      if (index === 0) return;
      const currentItem = this.paymentMethods[index];
      const previousItem = this.paymentMethods[index - 1];
      this.paymentMethods[index] = previousItem!;
      this.paymentMethods[index - 1] = currentItem!;
      await this.updateAndPersistOrder();
    },

    /** Move payment method one position down */
    async moveDown(index: number) {
      if (index >= this.paymentMethods.length - 1) return;
      const currentItem = this.paymentMethods[index];
      const nextItem = this.paymentMethods[index + 1];
      this.paymentMethods[index] = nextItem!;
      this.paymentMethods[index + 1] = currentItem!;
      await this.updateAndPersistOrder();
    },

    /** Add a new payment method */
    handleAddPaymentMethod(newPm: PaymentMethod) {
      const methods = this.paymentMethods;

      if (methods.length === 0) {
        // first item → always default
        newPm.isDefault = true;
        newPm.rank = 1;
        methods.push(newPm);
      } else if (newPm.isDefault) {
        // make new one default, shift others down
        for (const pm of methods) {
          pm.isDefault = false;
          pm.rank += 1;
        }
        newPm.rank = 1;
        methods.unshift(newPm);
      } else {
        // normal append to end
        newPm.isDefault = false;
        newPm.rank = methods.length + 1;
        methods.push(newPm);
      }

      this.syncTempSnapshot();
    },

    /** Update existing payment method */
    handleUpdatePaymentMethod(updatedPm: PaymentMethod) {
      const index = this.paymentMethods.findIndex(
        (pm) => pm.id === updatedPm.id,
      );

      if (index !== -1) {
        if (updatedPm.isDefault && index > 0) {
          // make it first and reorder
          this.paymentMethods.splice(index, 1);
          this.paymentMethods.unshift(updatedPm);
          this.paymentMethods.forEach((pm, i) => {
            pm.rank = i + 1;
            pm.isDefault = i === 0;
          });
        } else {
          // update inline
          this.paymentMethods[index] = updatedPm;
        }
      }

      this.syncTempSnapshot();
    },
  },
});
