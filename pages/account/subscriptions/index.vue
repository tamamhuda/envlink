<script setup lang="ts">
import {
  computed,
  definePageMeta,
  onMounted,
  ref,
  useSubscriptionStore,
} from "#imports";
import Content from "~/components/Content.vue";
import { CheckCircle, XCircle } from "lucide-vue-next";
import type { SubscriptionInfo } from "~/client";

definePageMeta({
  layout: "account",
  middleware: "require-upgradable",
});

const subscription = useSubscriptionStore();
const isReady = ref(false);
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

onMounted(() => {
  if (import.meta.client) {
    isReady.value = true;
  }
});
</script>

<template>
  <Content :is-ready="isReady && Boolean(currentSubscription)">
    <div class="space-y-8 w-full h-full flex flex-col">
      <!-- Current Subscription -->
      <div class="box-inner-card p-4 sm:p-8">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold leading-6">My Subscription</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your subscription plan and billing details.
            </p>
          </div>
          <div class="flex items-center gap-3">
            <NuxtLink
              v-if="
                currentSubscription && currentSubscription.plan.name !== 'Free'
              "
              :to="`/account/subscriptions/manage?id=${currentSubscription.id}`"
              class="button-box verbose hover:translate-x-0.5 hover:translate-y-0.5"
            >
              Manage
            </NuxtLink>
            <NuxtLink
              to="/account/subscriptions/upgrade"
              class="button-box hover:translate-x-0.5 hover:translate-y-0.5"
            >
              Upgrade Plan
            </NuxtLink>
          </div>
        </div>

        <div
          v-if="currentSubscription"
          class="mt-6 border-t border-(--border-color) pt-6"
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
      <div class="box-inner-card p-4 sm:p-8">
        <h3 class="text-lg font-semibold leading-6">Subscription History</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your previous subscription records.
        </p>
        <div v-if="pastSubscriptions.length > 0" class="mt-6 flow-root">
          <ul role="list" class="space-y-4">
            <li
              v-for="sub in pastSubscriptions"
              :key="sub.id"
              class="card-box p-4"
            >
              <div class="flex items-center flex-1 min-w-0">
                <div class="mr-4">
                  <CheckCircle
                    v-if="sub.status === 'ACTIVE'"
                    class="h-6 w-6 text-green-500"
                  />
                  <XCircle v-else class="h-6 w-6 text-red-500" />
                </div>
                <div class="ml-4 space-y-1 flex-1 min-w-0">
                  <p class="text-sm font-medium">{{ sub.plan.name }} Plan</p>
                  <p class="text-xs opacity-60 mt-0.5">
                    {{ formatDate(sub.startedAt) }} -
                    {{ formatDate(sub.expiresAt) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3 ml-4">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-(--text-color) capitalize"
                  :class="{
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800':
                      sub.status === 'PENDING',
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 border border-green-200 dark:border-green-800':
                      sub.status === 'ACTIVE',
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 border border-red-200 dark:border-red-800':
                      sub.status === 'INACTIVE' || sub.status === 'EXPIRED',
                  }"
                >
                  {{ sub.status.toLowerCase() }}
                </span>
                <NuxtLink
                  :to="`/account/subscriptions/manage?id=${sub.id}`"
                  class="button-box-small primary"
                >
                  Manage
                </NuxtLink>
              </div>
            </li>
          </ul>
        </div>
        <div v-else class="text-sm opacity-70 text-center mt-8">
          <p>You don't have any past subscriptions yet.</p>
        </div>
      </div>
    </div>
  </Content>
</template>
