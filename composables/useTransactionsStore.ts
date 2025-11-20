import { useTransactionsApi } from "#imports";
import { get } from "lodash";
import { defineStore } from "pinia";
import type { Transaction } from "~/client";

export const useTransactionsStore = defineStore("transactions", {
  state: () => ({
    transactions: [] as Transaction[],
    initialized: false,
  }),
  actions: {
    async initializeTransactions() {
      if (this.initialized) return;
      const { getAllTransactions, response } = useTransactionsApi().getAll();

      await getAllTransactions();
      if (response.value) this.setTransactions(response.value.data);
      this.initialized = true;
    },
    setTransactions(transactions: Transaction[]) {
      this.transactions = transactions;
    },
  },
});
