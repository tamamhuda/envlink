import { defineStore } from "pinia";
import { useEnvlink, useSubscriptionApi } from "#imports";
import type {
  SubscriptionCycle,
  SubscriptionInfo,
  SubscriptionUpgradeOption,
  UpgradeSubscriptionRequest,
} from "~/client";
import type {
  UpgradeDetails,
  UpgradeMetadata,
} from "~/interfaces/subscriptions";

interface SubscriptionState {
  subscriptions: SubscriptionInfo[];
  activeSubscription: SubscriptionInfo | null;
  pendingSubscription: SubscriptionInfo | null;
  currentPlan: SubscriptionInfo["plan"] | null;
  availablePlans: SubscriptionUpgradeOption[];
  selectedPlan: SubscriptionUpgradeOption | null;
  upgradeRequest: UpgradeSubscriptionRequest | null;
  upgradeMetadata: UpgradeMetadata | null;
  currentCycles: SubscriptionCycle[];
  isUpgradeRequested: boolean;
  initialized: boolean;
}

export const useSubscriptionStore = defineStore("subscription", {
  state: (): SubscriptionState => ({
    subscriptions: [],
    activeSubscription: null,
    pendingSubscription: null,
    currentCycles: [],
    currentPlan: null,
    availablePlans: [],
    selectedPlan: null,
    upgradeRequest: null,
    initialized: false,
    isUpgradeRequested: false,
    upgradeMetadata: null,
  }),

  getters: {
    isUpgradable: (state) => !!state.availablePlans.find((p) => p.upgradable),
    currentPlanName: (state) => state.currentPlan?.name ?? "Free",
  },

  actions: {
    async initializeSubscription() {
      if (this.initialized) return;
      const { getActiveSubscription, response } =
        useSubscriptionApi().getActive();

      const { getAllSubscriptions, response: allResponse } =
        useSubscriptionApi().getAll();

      await Promise.all([getActiveSubscription(), getAllSubscriptions()]);

      if (response.value) {
        const subscription = response.value.data;
        this.activeSubscription = subscription;

        await this.initializeUpgrade(subscription.id);
      }

      if (allResponse.value) {
        this.setSubscriptions(allResponse.value.data);
      }

      this.initialized = true;
    },

    setSubscriptions(data: SubscriptionInfo[]) {
      this.subscriptions = data.filter(
        (s) => s.status !== "ACTIVE" && s.plan.name !== "Free",
      );
      this.pendingSubscription =
        data.find((s) => s.status === "PENDING") ?? null;
    },

    async initializeUpgrade(id: string) {
      const envlink = useEnvlink();
      // Fetch available plans and set current plan
      const { execute: getUpgradeOptions, response } =
        envlink.subscriptions.getUpgradeOptions();

      await getUpgradeOptions({
        id,
      });

      if (response.value) {
        this.availablePlans = response.value.data;
        this.currentPlan =
          this.availablePlans.find(
            (p) => p.name === this.activeSubscription?.plan.name,
          ) ?? null;
      }
    },
    setUpgradeRequested(data: SubscriptionInfo) {
      this.pendingSubscription = data;
      this.isUpgradeRequested = true;
    },

    setPendingSubscription(data: SubscriptionInfo) {
      this.pendingSubscription = data;
    },

    selectPlan(planId: string) {
      const plan = this.availablePlans.find((p) => p.id === planId);
      if (!plan) return;
      this.selectedPlan = plan;
    },

    setUpgradeRequest(data: UpgradeSubscriptionRequest) {
      this.upgradeRequest = data;
    },

    setUpgradeMetadata(details: UpgradeDetails) {
      this.upgradeMetadata = {
        intervalLabel: details.intervalLabel,
        recurrenceLabel: details.recurrenceLabel,
        basePrice: details.basePrice,
        totalPrice: details.total,
        strategy: details.strategy,
        intervalDiscount: {
          rate: details.intervalDetails?.discount,
          amount: details.intervalDiscountAmount,
        },
        promoDiscount: details.promoCode
          ? {
              code: details.promoCode?.code,
              rate: details.promoCode?.discount,
              amount: details.promoDiscountAmount,
            }
          : null,
        proratedCredit: {
          amount: details.proratedCredit,
          description: "Credit applied for unused time from previous plan",
        },
        selectedInterval: {
          interval: details.intervalDetails!.value.interval,
          interval_count: details.intervalDetails!.value.interval_count,
          priceMultiplier: details.intervalDetails!.priceMultiplier,
        },
      };
    },

    clearUpgradeRequired() {
      this.selectedPlan = null;
      this.upgradeRequest = null;
      this.isUpgradeRequested = false;
      this.upgradeMetadata = null;
    },
  },
});
