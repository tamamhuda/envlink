import { navigateTo, useApi, useAuthStore } from "#imports";
import type {
  ChangePasswordRequest,
  ErrorResponse,
  UserResponse,
} from "~/interfaces/api.interface";

export function useAccountApi() {
  const authStore = useAuthStore();

  const clearAuth = () => {
    authStore.clearAuth();
  };

  const useFetchResendVerify = async () => {
    const { execute, data, pending, error } = await useApi<
      string,
      ErrorResponse
    >(
      "/api/v1/account/verify/resend",
      {
        method: "POST",
        immediate: false,
      },
      true,
    );

    return { fetchResendVerify: execute, data, pending, error };
  };

  const useFetchLogout = async () => {
    const { execute, data, pending, error } = await useApi<null, ErrorResponse>(
      "/api/v1/account/logout",
      {
        method: "POST",
        immediate: false,
        onResponse: ({ response }) => {
          if (response.status === 204) {
            clearAuth();
            navigateTo("/login");
          }
        },
      },
      true,
    );

    return { fetchLogout: execute, data, pending, error };
  };

  const useFetchChangePassword = async (body: ChangePasswordRequest) => {
    const { execute, data, pending, error } = await useApi<
      UserResponse,
      ErrorResponse
    >(
      "/api/v1/account/change-password",
      {
        method: "POST",
        immediate: false,
        body,
      },
      true,
    );

    return { fetchChangePassword: execute, data, pending, error };
  };

  return {
    useFetchResendVerify,
    useFetchLogout,
    useFetchChangePassword,
  };
}
