import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { computed, useSubscriptionStore } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
  const subscription = useSubscriptionStore();
  const isBasePage = to.path === "/account/subscriptions";

  if (isBasePage) return;

  // Wait until subscription store is initialized
  if (import.meta.client) {
    await subscription.initializeSubscription();
  }

  const activeSub = subscription.activeSubscription;
  const accessableSuccess = computed(() =>
    Boolean(
      subscription.pendingSubscription && subscription.isUpgradeRequested,
    ),
  );
  const isUpgradeRequestSuccessRoute = to.path.includes("/upgrade/success");
  const isRequireUpgrabaleRoute = ["/upgrade/confirm", "/upgrade/preview"].some(
    (p) => to.path.includes(p),
  );

  if (isUpgradeRequestSuccessRoute && !accessableSuccess.value) {
    return navigateTo("/account/subscriptions");
  }

  // Redirect if user has no active subscription
  if (!activeSub && subscription.initialized) {
    return navigateTo("/account/subscriptions");
  }

  // Not upgradable (no available plans or none marked upgradable)
  if (!subscription.isUpgradable && subscription.initialized) {
    return navigateTo("/account/subscriptions");
  }

  // Prevent access to confirm/preview if no selected plan or option
  if (isRequireUpgrabaleRoute && !subscription.selectedPlan) {
    return navigateTo("/account/subscriptions/upgrade");
  }

  return;

  // Allow navigation
});
