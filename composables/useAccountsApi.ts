import { navigateTo, useAuthStore, useEnvlink } from "#imports";
import type { ChangePasswordRequest } from "~/client";

export function useAccountApi() {
  const authStore = useAuthStore();
  const envlink = useEnvlink();

  const clearAuth = () => {
    authStore.clearAuth();
  };

  const verifyResend = async () => {
    const { execute, response, pending, error } =
      envlink.account.verifyResend();

    const resendVerification = async () => {
      await execute({
        xClientUrl: "http://localhost:4000",
      });
    };

    return { resendVerification, response, pending, error };
  };

  const logout = async () => {
    const { execute, error, response, ...rest } = envlink.account
      .withPostMiddleware(async ({ response }) => {
        if (response.status === 204) {
          clearAuth();
          await navigateTo("/login");
        }
      })
      .logout();

    return { logout: execute, ...rest };
  };

  const changePassword =  () => {
    const { execute, ...rest } = envlink.account.changePassword();

    const changePassword = async (body: ChangePasswordRequest) => {
      await execute({
        changePasswordRequest: body,
      });
    };

    return { changePassword, ...rest };
  };

  return {
    verifyResend,
    logout,
    changePassword,
  };
}
