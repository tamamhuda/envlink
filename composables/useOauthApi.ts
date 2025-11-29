import { useAuthStore, useEnvlink, useRuntimeConfig } from "#imports";
import type { Authenticated } from "~/client";

export const useOauthApi = () => {
  const envlink = useEnvlink();
  const authStore = useAuthStore();
  const { setUser, setTokens } = authStore;
  const baseUrl = useRuntimeConfig().public.appUrl;

  const Initialized = (auth: Authenticated) => {
    authStore.initialized = true;
    setUser(auth.user);
    setTokens(auth.tokens);
  };

  const googleSignIn = () => {
    const { execute, response, ...rest } = envlink.oauth.signInWithGoogle();
    const signInWithGoogle = async (path?: string) => {
      await execute({
        redirect: `${baseUrl}${path || "oauth/callback"}`,
        direct: false,
      });
      if (response.value && response.value.data.url) {
        return response.value.data;
      }
    };
    return { signInWithGoogle, ...rest };
  };

  const exchangeCode = () => {
    const { execute, response, ...rest } = envlink.oauth.exchangeCode();
    const exchangeCode = async (code: string) => {
      await execute({
        exchangeCodeRequest: {
          code,
        },
      });
      if (response.value) Initialized(response.value.data);
    };
    return { exchangeCode, ...rest };
  };

  const googleCredential = () => {
    const { execute, response, ...rest } = envlink.oauth.googleCredential();

    const signInWithGoogleCredential = async (credential: string) => {
      await execute({
        googleCredentialRequest: {
          credential,
        },
      });
      if (response.value) Initialized(response.value.data);
    };
    return { signInWithGoogleCredential, ...rest };
  };

  return {
    googleSignIn,
    exchangeCode,
    googleCredential,
  };
};
