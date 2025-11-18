import { Configuration } from "../src/generated";
import { reactiveApi } from "../src/wrap/reactiveApi";
import type {
  AuthConfig,
  EnvlinkClientOptions,
  ReactiveApi,
} from "../src/wrap/types";
import * as UserApiModule from "../src/generated/apis/UserApi";

/* ------------------------------------------------------------- */
/*                   Dynamic Configuration                     */
/* ------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */ /* EnvlinkClient Class */ /* -------------------------------------------------------------------------- */ export class EnvlinkClient {
  public userApi: ReactiveApi<UserApiModule.UserApi>;
  constructor({ config, auth }: EnvlinkClientOptions) {
    const configuration = new EnvlinkConfiguration(config, auth);
    this.userApi = reactiveApi(new UserApiModule.UserApi(configuration), auth);
  }
}
