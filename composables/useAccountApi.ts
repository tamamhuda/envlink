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
    const { execute, error, response, ...rest } = envlink.account.logout();

    const logout = async () => {
      await execute();
      if (!error.value) {
        clearAuth();
        navigateTo("/login");
      }
    };

    return { logout, ...rest };
  };

  const changePassword = async () => {
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
