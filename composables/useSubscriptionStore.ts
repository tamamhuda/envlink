import { defineStore } from "pinia";
import { useEnvlink } from "#imports";
import type {
  SubscriptionCycle,
  SubscriptionInfo,
  SubscriptionUpgradeOption,
  SubscriptionUpgradeOptionOptionsInnerStrategyEnum,
  UpgradeSubscriptionRequest,
} from "~/client";

export type UpgradeStrategy = SubscriptionUpgradeOptionOptionsInnerStrategyEnum;

export type ScheduleInterval = {
  label: "Monthly" | "Quarterly" | "Yearly";
  value: {
    interval: "MONTH" | "YEAR";
    interval_count: number;
  };
  priceMultiplier: number;
  discount?: number;
};

export type UpgradeDetails = {
  planName: "Free" | "Starter" | "Pro" | "Enterprise";
  strategy: "UPGRADE_IMMEDIATELY" | "FINISH_CURRENT_CYCLE";
  intervalLabel: "Monthly" | "Quarterly" | "Yearly";
  recurrenceLabel: string;
  total: number;
  discount: number;
  promoCode: {
    code: string;
    discount: number;
  } | null;
  proratedCredit: number;
  basePrice: number;
  intervalDiscountAmount: number;
  promoDiscountAmount: number;
  selectedInterval: ScheduleInterval | undefined;
};

interface UpgradeMetadata {
  intervalLabel: "Monthly" | "Quarterly" | "Yearly";
  recurrenceLabel: string;
  strategy: UpgradeStrategy;
  basePrice: number;
  intervalDiscount: {
    rate?: number;
    amount: number;
  };
  promoDiscount: {
    code: string;
    rate: number;
    amount: number;
  } | null;
  proratedCredit: {
    amount: number;
    description: string;
  };
  selectedInterval: {
    interval: "MONTH" | "YEAR";
    interval_count: number;
    priceMultiplier: number;
  };
}

interface SubscriptionState {
  activeSubscription: SubscriptionInfo | null;
  currentPlan: SubscriptionInfo["plan"] | null;
  availablePlans: SubscriptionUpgradeOption[];
  selectedPlan: SubscriptionUpgradeOption | null;
  upgradeRequest: UpgradeSubscriptionRequest | null;
  upgradeMetadata: UpgradeMetadata | null;
  currentCycles: SubscriptionCycle[];
  initialized: boolean;
}

export const useSubscriptionStore = defineStore("subscription", {
  state: (): SubscriptionState => ({
    activeSubscription: null,
    currentCycles: [],
    currentPlan: null,
    availablePlans: [],
    selectedPlan: null,
    upgradeRequest: null,
    initialized: false,
    upgradeMetadata: null,
  }),

  getters: {
    isUpgradable: (state) => !!state.availablePlans.find((p) => p.upgradable),
    currentPlanName: (state) => state.currentPlan?.name ?? "Free",
  },

  actions: {
    async initializeSubscription(subscription: SubscriptionInfo) {
      this.activeSubscription = subscription;
      await this.initializeUpgrade(subscription.id);
      this.initialized = true;
    },

    async initializeUpgrade(id: string) {
      const envlink = useEnvlink();
      // Fetch available plans and set current plan
      const { execute: getUpgradeOptions, response } =
        envlink.subscriptions.getUpgradeOptions();

      await getUpgradeOptions({
        id,
      });

      if (response.value && response.value.data) {
        this.availablePlans = response.value.data;
        this.currentPlan =
          this.availablePlans.find(
            (p) => p.name === this.activeSubscription?.plan.name,
          ) ?? null;
      }
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
        strategy: details.strategy,
        intervalDiscount: {
          rate: details.selectedInterval?.discount,
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
          interval: details.selectedInterval!.value.interval,
          interval_count: details.selectedInterval!.value.interval_count,
          priceMultiplier: details.selectedInterval!.priceMultiplier,
        },
      };
    },

    clearSelection() {
      this.selectedPlan = null;
      this.upgradeRequest = null;
    },
  },
});
