import {
  useAuthStore,
  useSubscriptionStore,
  useTransactionsStore,
} from "#imports";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  const privateRoutes = ["/dashboard", "/account", "/settings"];

  const isPrivate = privateRoutes.some((r) => to.path.startsWith(r));

  const hasCookie = auth.hasCookie();

  // If no cookie and private → login
  if (!hasCookie && isPrivate) {
    return navigateTo("/login");
  }

  // If user has cookie → load auth state
  if (hasCookie && !auth.initialized) {
    await auth.initializeAuth();
  }

  const isAuth = auth.isAuthenticated === true;
  const isVerified = auth.user?.providers.isVerified === true;

  // If authenticated but not verified
  if (isAuth && !isVerified) {
    const redirectBlocked = ["/login", "/register", "/dashboard"];
    if (redirectBlocked.some((r) => to.path.startsWith(r))) {
      return navigateTo("/auth/verify");
    }
  }

  // initialized subscriptions
  if (isAuth && auth.initialized && import.meta.client) {
    await useSubscriptionStore().initializeSubscription();
    await useTransactionsStore().initializeTransactions();
  }

  // Allow authenticated private access
  if (isAuth && isPrivate) {
    return;
  }

  // // If cookie exists but auth failed after initialization → 401
  if (hasCookie && auth.initialized && !isAuth && isPrivate) {
    console.log(auth.initialized);
    return navigateTo("/error/401");
  }

  return;
});
