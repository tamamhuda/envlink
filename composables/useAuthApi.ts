import { navigateTo, useAuthStore, useEnvlink } from "#imports";
import type { LoginRequest, RegisterRequest, Tokens, UserInfo } from "~/client";

export const useAuthApi = () => {
  const envlink = useEnvlink();
  const authStore = useAuthStore();
  const { setUser, setTokens } = authStore;

  const Initialized = (user: UserInfo, tokens?: Tokens) => {
    authStore.initialized = true;
    setUser(user);
    if (tokens) {
      setTokens(tokens);
    }
  };

  const login = () => {
    const { execute, response, ...rest } = envlink.authentication.login();

    const login = async (body: LoginRequest) => {
      await execute({
        loginRequest: body,
      });
      if (response.value) {
        const { user } = response.value.data;

        Initialized(user);
      }
    };

    return { login, response, ...rest };
  };

  const register = () => {
    const { execute, response, ...rest } = envlink.authentication.register();

    const register = async (body: RegisterRequest) => {
      await execute({
        registerRequest: body,
        xClientUrl: "http://localhost:3000",
      });
      if (response.value) {
        const { user, tokens } = response.value.data;
        Initialized(user, tokens);
        await navigateTo({
          path: "/auth/verify",
          query: {
            from: "register",
          },
        });
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
