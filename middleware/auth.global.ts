import { defineNuxtRouteMiddleware, navigateTo, useAuthStore } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  // Wait for initialization

  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify",
  ];
  const isPublic = publicRoutes.some((route) => to.path.startsWith(route));
  const hasCookie = auth.hasCookie();

  // In your route middleware or entry logic
  if (!hasCookie && !isPublic) {
    // No cookie and private page
    return navigateTo("/login");
  }

  if (hasCookie) {
    await auth.initializeAuth();

    if (["/login", "/register"].includes(to.path)) {
      return navigateTo("/dashboard");
    }
  }
});
