import { useEnvlink, useSubscriptionStore } from "#imports";
import type { Plan, SubscriptionCycle, UpgradeSubscriptionRequest } from "~/client";

export const useSubscriptionApi = () => {
  const envlink = useEnvlink();
  const susbcriptionStore = useSubscriptionStore();
  const { setUpgradeRequested , setPlans} = susbcriptionStore;

  const setCurrentCycle = (data: SubscriptionCycle[]) => {
    susbcriptionStore.currentCycles = data;
  };

  const getActive = () => {
    const { execute, response, ...rest } = envlink.subscriptions.getActive();

    return { getActiveSubscription: execute, response, ...rest };
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

  const getAll = () => {
    const { execute, response, ...rest } = envlink.subscriptions.getAll();
    return { getAllSubscriptions: execute, response, ...rest };
  };

  const getById = () => {
    const { execute, response, ...rest } = envlink.subscriptions.getById();
    const getSubscriptionById = async (id: string) => {
      await execute({ id });
      if (response.value) {
        return response.value.data;
      }
    };
    return { getSubscriptionById, response, ...rest };
  };

  const upgrade = () => {
    const { execute, response, ...rest } = envlink.subscriptions.upgrade();
    const upgrade = async (
      id: string,
      upgradeSubscriptionRequest: UpgradeSubscriptionRequest,
    ) => {
      await execute({
        id,
        upgradeSubscriptionRequest,
      });
      if (response.value) {
        setUpgradeRequested(response.value.data);
      }
    };
    return { upgrade, response, ...rest };
  };

  const getAllPlans = () => {
    const { execute, response, ...rest } = envlink.publicSubscriptionsPlans.getAll();
    const getAllPlans = async (callback?: (data: Plan[]) => void) => {
      await execute();
      if (response.value) {
        callback?.(response.value.data);
      }
    };
    return { getAllPlans, response, ...rest };
  };

  return {
    upgrade,
    getActive,
    getCurrentCycle,
    getAll,
    getById,
    getAllPlans
  };
};
