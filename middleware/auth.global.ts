import { computed, useAuthStore, useSubscriptionStore } from "#imports";
import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/",
  ];
  const privateRoutes = ["/dashboard", "/account", "/settings"];

  const isPublic = publicRoutes.some((route) => to.path.startsWith(route));
  const isPrivate = privateRoutes.some((route) => to.path.startsWith(route));
  const hasCookie = auth.hasCookie();
  const isVerified = computed(() => auth.user?.providers.isVerified);

  // In your route middleware or entry logic
  if (!hasCookie && !isPublic) {
    // No cookie and private page
    return navigateTo("/login");
  }

  if (hasCookie) {
    await auth.initializeAuth();

    if (
      ["/login", "/register", "/dashboard"].includes(to.path) &&
      !isVerified.value
    ) {
      return navigateTo("/auth/verify");
    }
  } else if (!auth.isAuthenticated && isPrivate) {
    return navigateTo("/error/401");
  }
});
