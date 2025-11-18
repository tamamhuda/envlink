import { navigateTo, useAuthStore, useEnvlink } from "#imports";
import type { LoginRequest, RegisterRequest, UserInfo } from "~/client";

export const useAuthApi = () => {
  const envlink = useEnvlink();
  const authStore = useAuthStore();

  const setUser = (user: UserInfo) => {
    authStore.setUser(user);
  };

  const setInitialized = (initialized: boolean) => {
    authStore.initialized = initialized;
  };

  const login = () => {
    const { execute, response, ...rest } = envlink.authentication.login();

    const login = async (body: LoginRequest) => {
      await execute({
        loginRequest: body,
      });
      if (response.value) {
        const { user } = response.value.data;
        setUser(user);
        authStore.initialized = true;
        await navigateTo("/dashboard");
      }
    };

    return { login, response, ...rest };
  };

  const register = () => {
    const { execute, response, ...rest } = envlink.authentication.register();

    const register = async (body: RegisterRequest) => {
      await execute({
        registerRequest: body,
      });
      if (response.value) {
        const { user } = response.value.data;
        setUser(user);
        setInitialized(true);
        await navigateTo("/dashboard");
      }
    };

    return { register, response, ...rest };
  };

  const verify = () => {
    const { execute, response, ...rest } = envlink.authentication.verify();

    const verify = async (token: string) => {
      await execute({ token });
      if (response.value) {
        const user = response.value?.data;
        setUser(user);
      }
    };

    return { verify, response, ...rest };
  };

  return {
    login,
    register,
    verify,
  };
};
