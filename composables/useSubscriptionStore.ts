import { defineStore } from "pinia";
import { useEnvlink, useSubscriptionApi } from "#imports";
import type {
  Plan,
  SubscriptionCycle,
  SubscriptionInfo,
  SubscriptionUpgradeOption,
  UpgradeSubscriptionRequest,
} from "~/client";
import type { UpgradeDetails } from "~/interfaces/subscriptions";
import snakeCaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";

export type AvailablePlan = Pick<
  Plan,
  "name" | "description" | "features" | "cta" | "popular"
> & { priceLabel: string; badge?: string };

interface SubscriptionState {
  subscriptions: SubscriptionInfo[];
  activeSubscription: SubscriptionInfo | null;
  availablePlans: SubscriptionUpgradeOption[];
  selectedPlan: SubscriptionUpgradeOption | null;
  upgradeRequest: UpgradeSubscriptionRequest | null;
  currentCycles: SubscriptionCycle[];
  isUpgradeRequested: boolean;
  initialized: boolean;
  initializedPlans: boolean;
  plans: AvailablePlan[];
}

export const useSubscriptionStore = defineStore("subscription", {
  state: (): SubscriptionState => ({
    subscriptions: [],
    activeSubscription: null,
    currentCycles: [],
    availablePlans: [],
    selectedPlan: null,
    upgradeRequest: null,
    initialized: false,
    initializedPlans: false,
    isUpgradeRequested: false,
    plans: [],
  }),

  getters: {
    isUpgradable: (state) => state.availablePlans.some((p) => p.upgradable),
    currentPlan: (state) =>
      state.availablePlans.find(
        (p) => p.name === state.activeSubscription?.plan.name
      ) ?? null,
    upgradeMetadata: (state) =>
      camelcaseKeys(state.upgradeRequest?.metadata ?? {}) as UpgradeDetails,
    pendingSubscription: (state) =>
      state.subscriptions.find(
        (s) => s.status === "PENDING" && s.plan.name !== "Free"
      ) ?? null,
  },

  actions: {
    async initializeSubscription() {
      if (this.initialized) return;

      const api = useSubscriptionApi();
      const activeReq = api.getActive();
      const allReq = api.getAll();

      await Promise.all([
        activeReq.getActiveSubscription(),
        allReq.getAllSubscriptions(),
      ]);

      const active = activeReq.response.value?.data ?? null;
      if (active) {
        this.activeSubscription = active;
        await this.initializeUpgrade(active.id);
      }

      const allSubs = allReq.response.value?.data ?? [];
      this.setSubscriptions(allSubs);

      this.initialized = true;
    },

    setSubscriptions(list: SubscriptionInfo[]) {
      this.subscriptions = list.filter(
        (s) => s.status !== "ACTIVE" && s.plan.name !== "Free"
      );
    },

    async initializeUpgrade(id: string) {
      const { execute, response } =
        useEnvlink().subscriptions.getUpgradeOptions();
      await execute({ id });

      const plans = response.value?.data;
      if (!plans) return;

      this.availablePlans = plans;
    },

    async initializePublicPlans() {
      if (this.initializedPlans) return;
      const api = useSubscriptionApi();
      const planReq = api.getAllPlans();
      await planReq.getAllPlans(this.setPlans);
      this.initializedPlans = true;
    },

    setPlans(list: Plan[]) {
      const resolvePriceIDR = (price: number) => {
        return "IDR " + price / 1000 + "K";
      };

      const priceLabel = (plan: Plan) => {
        if (plan.name === "Free") {
          return "Free";
        }
        if (plan.name === "Enterprise") {
          return "Contact Us";
        }
        return resolvePriceIDR(plan.price);
      };

      this.plans = list.map((plan) => {
        return {
          ...plan,
          priceLabel: priceLabel(plan),
          badge: plan.popular
            ? "Most Popular"
            : plan.name === "Enterprise"
              ? "Soon"
              : undefined,
        };
      });
      console.log(this.plans);
    },

    setUpgradeRequested(data: SubscriptionInfo) {
      this.subscriptions.push(data);
      this.isUpgradeRequested = true;
    },

    selectPlan(planId: string) {
      this.selectedPlan =
        this.availablePlans.find((p) => p.id === planId) ?? null;
    },

    setUpgradeRequest(details: UpgradeDetails) {
      // const metadata = this.buildMetadata(details);
      const { priceMultiplier: _, ...schedule } = details.selectedInterval;

      this.upgradeRequest = {
        plan: details.planName,
        schedule,
        description: `Upgrade to ${details.planName} plan (${details.intervalLabel}, ${details.recurrenceLabel})`,
        amount: details.basePrice,
        strategy: details.strategy,
        discount:
          (details.intervalDiscount?.amount ?? 0) +
          (details.promoDiscount?.amount ?? 0),
        metadata: snakeCaseKeys(details),
      };
    },

    clearUpgradeRequired() {
      this.selectedPlan = null;
      this.upgradeRequest = null;
      this.isUpgradeRequested = false;
    },
  },
});
