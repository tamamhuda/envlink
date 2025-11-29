import { useAuthStore, useRouter } from "#imports";
import { EnvlinkClient } from "~/client";

import { Configuration } from "~/client/src/generated";

import type { AuthConfig, EnvlinkErrorContext } from "~/client/src/wrap/types";

export function useEnvlink() {
  const authStore = useAuthStore();

  const auth: AuthConfig = {
    getTokens: () => {
      const tokens = authStore.getTokens();
      if (!tokens) return null;
      return tokens;
    },
    setTokens: (tokens) => {
      authStore.setTokens(tokens);
    },
  };

  const config = new Configuration({
    accessToken: authStore.tokens?.accessToken,
    basePath: "https://local-nest.utadev.app",
  });

  const router = useRouter();

  const onError = async (error: EnvlinkErrorContext) => {
    if (error.type === "REFRESH_FAILED") {
      router.push("/error/401");
    } else if (
      error.type === "NETWORK_ERROR" ||
      (error.status && error.status >= 500)
    ) {
      router.push("/error/500");
    } else {
      console.log(error);
    }
    console.log(error);
  };

  return new EnvlinkClient({ config, auth, onError });
}
