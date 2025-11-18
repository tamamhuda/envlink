import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { useSubscriptionStore } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
  const subscription = useSubscriptionStore();

  // Wait until subscription store is initialized
  if (!subscription.initialized && import.meta.client) {
    await subscription.initializeUpgrade();
  }

  const activeSub = subscription.activeSubscription;

  // Redirect if user has no active subscription
  if (!activeSub && subscription.initialized) {
    return navigateTo("/account/subscriptions");
  }

  // Not upgradable (no available plans or none marked upgradable)
  if (!subscription.isUpgradable && subscription.initialized) {
    return navigateTo("/account/subscriptions");
  }

  // Prevent access to confirm/preview if no selected plan or option
  if (
    ["/upgrade/confirm", "/upgrade/preview"].some((p) => to.path.includes(p)) &&
    !subscription.selectedPlan
  ) {
    return navigateTo("/account/subscriptions/upgrade");
  }

  // Allow navigation
});
