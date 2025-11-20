<script setup lang="ts">
import { computed, definePageMeta, ref, useSubscriptionStore } from "#imports";
import Content from "~/components/Content.vue";
import { CheckCircle, XCircle } from "lucide-vue-next";
import type { SubscriptionInfo } from "~/client";

definePageMeta({
  layout: "account",
  middleware: "require-upgradable",
});

const subscription = useSubscriptionStore();
// const subscriptionApi = useSubscriptionApi();

// Dummy data based on the API type
const currentSubscription = computed(() => subscription.activeSubscription);

const pastSubscriptions = ref<SubscriptionInfo[]>(subscription.subscriptions);

const formatDate = (date: string | Date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <Content :is-ready="Boolean(currentSubscription)">
    <div class="space-y-8 w-full">
      <!-- Current Subscription -->
      <div
        class="rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold leading-6">My Subscription</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your subscription plan and billing details.
            </p>
          </div>
          <NuxtLink
            to="/account/subscriptions/upgrade"
            class="inline-flex items-center gap-2 rounded-lg border-l border-t border-white px-4 py-2 dark:bg-blue-700/80 text-white shadow-[inset_-3px_-3px_0_var(--text-color),inset_-1px_-1px_0_#0b0d40] hover:shadow-[inset_-3px_-3px_0_var(--text-color),inset_3px_3px_0_#0b0d40] transition-all focus:outline-none hover:translate-x-[2px] hover:translate-y-[2px] whitespace-pre"
          >
            Upgrade Plan
          </NuxtLink>
        </div>

        <div
          v-if="currentSubscription"
          class="mt-6 border-t border-[var(--border-color)] pt-6"
        >
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Plan
              </dt>
              <dd class="mt-1 text-lg font-semibold">
                {{ currentSubscription.plan.name }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </dt>
              <dd
                class="mt-1 text-lg font-semibold capitalize"
                :class="{
                  'text-green-600': currentSubscription.status === 'ACTIVE',
                  'text-red-600': currentSubscription.status !== 'ACTIVE',
                }"
              >
                {{ currentSubscription.status.toLowerCase() }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Price
              </dt>
              <dd class="mt-1 text-lg">
                ${{ currentSubscription.plan.price }} / month
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
                Next Billing Date
              </dt>
              <dd class="mt-1 text-lg">
                {{
                  currentSubscription.nextBillingDate
                    ? formatDate(currentSubscription.nextBillingDate)
                    : "N/A"
                }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Past Subscriptions -->
      <div
        class="rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
      >
        <h3 class="text-lg font-semibold leading-6">Subscription History</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your previous subscription records.
        </p>
        <div class="mt-6 flow-root">
          <ul role="list" class="space-y-4">
            <li
              v-for="sub in pastSubscriptions"
              :key="sub.id"
              class="relative flex items-center justify-between px-5 py-4 border border-[var(--text-color)] rounded-md bg-transparent text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)]"
            >
              <div class="flex items-center flex-1 min-w-0">
                <div class="mr-4">
                  <CheckCircle
                    v-if="sub.status === 'ACTIVE'"
                    class="h-6 w-6 text-green-500"
                  />
                  <XCircle v-else class="h-6 w-6 text-red-500" />
                </div>
                <div class="ml-4 flex-1 min-w-0">
                  <p class="text-sm font-medium">{{ sub.plan.name }} Plan</p>
                  <p class="text-xs opacity-60 mt-0.5">
                    {{ formatDate(sub.startedAt) }} -
                    {{ formatDate(sub.expiresAt) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3 ml-4">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-[var(--text-color)] capitalize"
                >
                  {{ sub.status.toLowerCase() }}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Content>
</template>
