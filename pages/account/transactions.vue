<script setup lang="ts">
import { definePageMeta, ref } from "#imports";
import type { components } from "~/types/api.d";
import Content from "~/components/Content.vue";

definePageMeta({
  layout: "account",
});

type Transaction =
  components["schemas"]["ListTransactionsResponse"]["data"][number];

// Dummy data
const transactions = ref<Transaction[]>([
  {
    id: "txn_1",
    created_at: new Date("2023-11-01").toISOString(),
    product_name: "Pro Plan - Monthly",
    amount: 15.0,
    currency: "USD",
    status: "PAID",
    invoice_url: "#",
    user_id: "user_123",
    cycle_id: "cycle_1",
    payment_method_id: "pm_1",
    subscription_id: "sub_123",
    reference_id: "ref_txn_1",
    payment_method_type: "CARD",
    payment_type: "PAYMENT_LINK",
    metadata: null,
    paid_at: new Date("2023-11-01").toISOString(),
    failed_at: null,
    failure_code: null,
    refunded_at: null,
    invoice_id: "inv_1",
    invoice_number: "2023-001",
    invoice_pdf_path: null,
    updated_at: new Date("2023-11-01").toISOString(),
  },
  {
    id: "txn_2",
    created_at: new Date("2023-10-01").toISOString(),
    product_name: "Pro Plan - Monthly",
    amount: 15.0,
    currency: "USD",
    status: "PAID",
    invoice_url: "#",
    user_id: "user_123",
    cycle_id: "cycle_2",
    payment_method_id: "pm_1",
    subscription_id: "sub_123",
    reference_id: "ref_txn_2",
    payment_method_type: "CARD",
    payment_type: "PAYMENT_LINK",
    metadata: null,
    paid_at: new Date("2023-10-01").toISOString(),
    failed_at: null,
    failure_code: null,
    refunded_at: null,
    invoice_id: "inv_2",
    invoice_number: "2023-002",
    invoice_pdf_path: null,
    updated_at: new Date("2023-10-01").toISOString(),
  },
]);

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
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
</script>

<template>
  <Content :is-ready="true">
    <div class="space-y-8">
      <div
        class="rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
      >
        <div>
          <h3 class="text-lg font-semibold leading-6">Transaction History</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View your past payments and invoices.
          </p>
        </div>

        <div class="mt-6 flow-root">
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
                      {{ formatDate(txn.created_at) }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm">
                      {{ txn.product_name }}
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
                        :href="txn.invoice_url || '#'"
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
