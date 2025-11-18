import { useAuthStore } from "#imports";
import { createEnvlinkClient } from "~/client";

import { Configuration, instanceOfErrorResponse } from "~/client/src/generated";
import type { AuthConfig } from "~/client/src/wrap/types";

export function useEnvlink() {
  const auth = useAuthStore();

  const authConfig: AuthConfig = {
    getTokens: () => {
      if (!auth.tokens) return null;
      return auth.tokens;
    },
    setTokens: (tokens) => {
      auth.setTokens(tokens);
    },
    onRefreshFailed: () => {
      console.log("Envlink client: Refresh failed Callback");
    },
  };

  const config = new Configuration({
    accessToken: auth.tokens?.accessToken,
    basePath: "https://local-nest.utadev.app",
    middleware: [
      {
        post: async ({ response }) => {
          console.log("Envlink client: Middleware ");
          const res = await response.json();
          const err = instanceOfErrorResponse(res) ? res : null;
          // only log when err.status between 400 and 500
          if (err && err.status && err.status >= 400 && err.status < 500) {
            console.log("Envlink client: Response Error", err);
          }
        },
      },
    ],
  });

  // return new EnvlinkClient({ config, auth: authConfig });
  return createEnvlinkClient(config, authConfig);
}
