import { Configuration } from "~/client/src/generated";
import type { AuthConfig } from "./types";

export class EnvlinkConfiguration extends Configuration {
  constructor(
    baseConfig: Configuration,
    private auth?: AuthConfig,
  ) {
    super({
      basePath: baseConfig.basePath,
      middleware: baseConfig.middleware,
      accessToken: async (name?: string, scopes?: string[]) => {
        if (!auth?.getTokens) {
          const original = baseConfig.accessToken;
          if (typeof original === "function")
            return await original(name, scopes);
          return original ?? "";
        }

        const tokensResult = await auth.getTokens();
        const tokens =
          tokensResult instanceof Promise ? await tokensResult : tokensResult;
        return tokens?.accessToken ?? "";
      },
    });
  }
}
