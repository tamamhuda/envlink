<script setup lang="ts">
import type { BillingAddress } from "~/interfaces/api.interface";

defineProps<{
  address: BillingAddress | null | undefined;
}>();

const emit = defineEmits<{
  (e: "change"): void;
}>();
</script>

<template>
  <div
    class="p-8 border border-[var(--text-color)] rounded-md text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)]"
  >
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-semibold leading-6">Billing Address</h3>
        <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Your default address for all invoices.
        </p>
      </div>
      <button
        class="inline-flex items-center gap-2 rounded-lg border border-[var(--text-color)] px-4 py-2 text-sm font-medium shadow-[2px_2px_0_var(--text-color)] hover:shadow-[2px_2px_0_#2563eb] transition-all"
        @click="$emit('change')"
      >
        Change
      </button>
    </div>
    <div
      v-if="address"
      class="mt-6 border-t border-[var(--text-color)] pt-6 text-sm space-y-1"
    >
      <p class="font-medium">
        {{ address.first_name }}
        {{ address.last_name }}
      </p>
      <p>{{ address.address1 }}</p>
      <p v-if="address.address2">
        {{ address.address2 }}
      </p>
      <p>
        {{ address.city }},
        {{ address.state }}
        {{ address.zip }}
      </p>
      <p>{{ address.country }}</p>
    </div>
    <div v-else class="mt-6 border-t border-[var(--text-color)] pt-6 text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        No default billing address selected.
      </p>
    </div>
  </div>
</template>
