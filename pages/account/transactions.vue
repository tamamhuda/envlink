<script setup lang="ts">
import { definePageMeta, onMounted, ref, useTransactionsStore } from "#imports";
import type { Transaction } from "~/client";
import Content from "~/components/Content.vue";
import {
  TransactionStatusEnum,
  TransactionPaymentTypeEnum,
} from "~/client/src/generated/models/Transaction";

definePageMeta({
  layout: "account",
});

const txnStore = useTransactionsStore();
const isReady = ref(false);

// Dummy data
const transactions = ref<Transaction[]>(txnStore.transactions);

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount: number, currency: string | null) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
};

onMounted(() => {
  if (import.meta.client) {
    isReady.value = true;
  }
});
</script>

<template>
  <Content :is-ready="isReady">
    <div class="space-y-8">
      <div
        class="p-8 border border-[var(--text-color)] rounded-md text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)]"
      >
        <div class="mb-6">
          <h3 class="text-lg font-semibold leading-6">Transaction History</h3>
          <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            View your past payments and invoices.
          </p>
        </div>

        <div class="flow-root">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
            >
              <table class="min-w-full divide-y divide-[var(--border-color)]">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-0"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      class="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Status
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="sr-only">Invoice</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[var(--border-color)]">
                  <tr v-for="txn in transactions" :key="txn.id">
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0"
                    >
                      {{ formatDate(txn.createdAt) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      {{ txn.productName }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      {{ formatCurrency(txn.amount, txn.currency) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-green-100 text-green-800': txn.status === 'PAID',
                          'bg-yellow-100 text-yellow-800':
                            txn.status === 'PENDING',
                          'bg-red-100 text-red-800': txn.status === 'FAILED',
                        }"
                      >
                        {{ txn.status }}
                      </span>
                    </td>
                    <td
                      class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"
                    >
                      <a
                        :href="txn.invoiceUrl || '#'"
                        target="_blank"
                        class="text-indigo-600 hover:text-indigo-900"
                        >Invoice</a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Content>
</template>
