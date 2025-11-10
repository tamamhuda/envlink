import { navigateTo, useApi, useAuthStore } from "#imports";
import type {
  AuthResponse,
  ErrorResponse,
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from "~/interfaces/api.interface";

export function useAuthApi() {
  const auth = useAuthStore();

  const setUser = (user: any) => {
    auth.setUser(user);
  };

  const setTokens = (tokens: any) => {
    auth.setTokens(tokens);
  };

  const setInitialized = (initialized: boolean) => {
    auth.initialized = initialized;
  };

  const useFetchLogin = async (body: LoginRequest) => {
    const { refresh, pending, error } = await useApi<
      AuthResponse,
      ErrorResponse
    >("/api/v1/auth/login", {
      method: "POST",
      body,
      immediate: false,
      onResponse: async ({ response }) => {
        if (response.status === 200 && response._data) {
          const { tokens, user } = response._data.data;
          setTokens(tokens);
          setUser(user);
          setInitialized(true);
          await navigateTo("/dashboard");
        }
      },
    });

    return { login: refresh, pending, error };
  };

  const useFetchRegister = async (body: RegisterRequest) => {
    const { refresh, pending, error } = await useApi<
      AuthResponse,
      ErrorResponse
    >("/api/v1/auth/register", {
      method: "POST",
      body,
      immediate: false,
      onResponse: async ({ response }) => {
        if (response.status === 201 && response._data) {
          const { tokens, user } = response._data.data;
          setTokens(tokens);
          setUser(user);
          await navigateTo({
            path: "/auth/verify",
            query: { from: "register" },
          });
        }
      },
    });

    return { register: refresh, pending, error };
  };

  const useFetchVerify = async (token: string) => {
    const { execute, data, pending, error } = await useApi<
      UserResponse,
      ErrorResponse
    >("/api/v1/auth/verify", {
      method: "GET",
      immediate: false,
      query: {
        token,
      },
      onResponse: ({ response }) => {
        if (response._data?.data) {
          setUser(response._data.data);
        }
      },
    });

    return { fetchVerify: execute, data, pending, error };
  };

  return {
    useFetchLogin,
    useFetchRegister,
    useFetchVerify,
  };
}
