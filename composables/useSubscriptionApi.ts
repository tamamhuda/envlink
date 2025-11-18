import { useEnvlink, useSubscriptionStore } from "#imports";
import type { SubscriptionCycle, SubscriptionInfo } from "~/client";

export const useSubscriptionApi = () => {
  const envlink = useEnvlink();
  const susbcriptionStore = useSubscriptionStore();

  const initializeSubscription = (data: SubscriptionInfo) => {
    susbcriptionStore.initializeSubscription(data);
  };

  const setCurrentCycle = (data: SubscriptionCycle[]) => {
    susbcriptionStore.currentCycles = data;
  };

  const getActive = () => {
    const { execute, response, ...rest } = envlink.subscriptions.getActive();

    const getActiveSubscription = async () => {
      await execute();
      if (response.value && response.value.data) {
        initializeSubscription(response.value.data);
      }
    };

    return { getActiveSubscription, response, ...rest };
  };

  const getCurrentCycle = async () => {
    const { response, execute } =
      envlink.subscriptions.getAllActiveSubscriptionCycles();
    await execute();
    if (response.value && response.value.data) {
      setCurrentCycle(response.value.data);
    }
    return response;
  };

  return {
    getActive,
    getCurrentCycle,
  };
};
