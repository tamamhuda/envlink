import type {
  AuthConfig,
  EnvlinkClientOptions,
  ReactiveApi,
} from "./wrap/types";

import * as AccountApiModule from "./generated/apis/AccountApi";
import * as AnalyticsApiModule from "./generated/apis/AnalyticsApi";
import * as AuthenticationApiModule from "./generated/apis/AuthenticationApi";
import * as HealthApiModule from "./generated/apis/HealthApi";
import * as PaymentMethodsApiModule from "./generated/apis/PaymentMethodsApi";
import * as PublicPaymentMethodsApiModule from "./generated/apis/PublicPaymentMethodsApi";
import * as PublicSubscriptionsPlansApiModule from "./generated/apis/PublicSubscriptionsPlansApi";
import * as PublicURLsApiModule from "./generated/apis/PublicURLsApi";
import * as SessionsApiModule from "./generated/apis/SessionsApi";
import * as SubscriptionsApiModule from "./generated/apis/SubscriptionsApi";
import * as TransactionsApiModule from "./generated/apis/TransactionsApi";
import * as UrlsApiModule from "./generated/apis/UrlsApi";
import * as UserApiModule from "./generated/apis/UserApi";

import { EnvlinkConfiguration } from "./wrap/config";
import { reactiveApi } from "./wrap/reactiveApi";
import type { Configuration } from "./generated";

type EnvlinkApis = {
  account: AccountApiModule.AccountApi;
  analytics: AnalyticsApiModule.AnalyticsApi;
  authentication: AuthenticationApiModule.AuthenticationApi;
  health: HealthApiModule.HealthApi;
  paymentMethods: PaymentMethodsApiModule.PaymentMethodsApi;
  publicPaymentMethods: PublicPaymentMethodsApiModule.PublicPaymentMethodsApi;
  publicSubscriptionsPlans: PublicSubscriptionsPlansApiModule.PublicSubscriptionsPlansApi;
  publicURLs: PublicURLsApiModule.PublicURLsApi;
  sessions: SessionsApiModule.SessionsApi;
  subscriptions: SubscriptionsApiModule.SubscriptionsApi;
  transactions: TransactionsApiModule.TransactionsApi;
  urls: UrlsApiModule.UrlsApi;
  user: UserApiModule.UserApi;
};

export class EnvlinkClient {
  public account: ReactiveApi<AccountApiModule.AccountApi>;
  public analytics: ReactiveApi<AnalyticsApiModule.AnalyticsApi>;
  public authentication: ReactiveApi<AuthenticationApiModule.AuthenticationApi>;
  public health: ReactiveApi<HealthApiModule.HealthApi>;
  public paymentMethods: ReactiveApi<PaymentMethodsApiModule.PaymentMethodsApi>;
  public publicPaymentMethods: ReactiveApi<PublicPaymentMethodsApiModule.PublicPaymentMethodsApi>;
  public publicSubscriptionsPlans: ReactiveApi<PublicSubscriptionsPlansApiModule.PublicSubscriptionsPlansApi>;
  public publicURLs: ReactiveApi<PublicURLsApiModule.PublicURLsApi>;
  public sessions: ReactiveApi<SessionsApiModule.SessionsApi>;
  public subscriptions: ReactiveApi<SubscriptionsApiModule.SubscriptionsApi>;
  public transactions: ReactiveApi<TransactionsApiModule.TransactionsApi>;
  public urls: ReactiveApi<UrlsApiModule.UrlsApi>;
  public user: ReactiveApi<UserApiModule.UserApi>;

  constructor({ config, auth }: EnvlinkClientOptions) {
    const configuration = new EnvlinkConfiguration(config, auth);

    this.account = reactiveApi(
      new AccountApiModule.AccountApi(configuration),
      auth,
    );
    this.analytics = reactiveApi(
      new AnalyticsApiModule.AnalyticsApi(configuration),
      auth,
    );
    this.authentication = reactiveApi(
      new AuthenticationApiModule.AuthenticationApi(configuration),
      auth,
    );
    this.health = reactiveApi(
      new HealthApiModule.HealthApi(configuration),
      auth,
    );
    this.paymentMethods = reactiveApi(
      new PaymentMethodsApiModule.PaymentMethodsApi(configuration),
      auth,
    );
    this.publicPaymentMethods = reactiveApi(
      new PublicPaymentMethodsApiModule.PublicPaymentMethodsApi(configuration),
      auth,
    );
    this.publicSubscriptionsPlans = reactiveApi(
      new PublicSubscriptionsPlansApiModule.PublicSubscriptionsPlansApi(
        configuration,
      ),
      auth,
    );
    this.publicURLs = reactiveApi(
      new PublicURLsApiModule.PublicURLsApi(configuration),
      auth,
    );
    this.sessions = reactiveApi(
      new SessionsApiModule.SessionsApi(configuration),
      auth,
    );
    this.subscriptions = reactiveApi(
      new SubscriptionsApiModule.SubscriptionsApi(configuration),
      auth,
    );
    this.transactions = reactiveApi(
      new TransactionsApiModule.TransactionsApi(configuration),
      auth,
    );
    this.urls = reactiveApi(new UrlsApiModule.UrlsApi(configuration), auth);
    this.user = reactiveApi(new UserApiModule.UserApi(configuration), auth);
  }
}

export function createEnvlinkClient(config: Configuration, auth?: AuthConfig) {
  const configuration = new EnvlinkConfiguration(config, auth);

  return {
    account: reactiveApi(new AccountApiModule.AccountApi(configuration), auth),
    analytics: reactiveApi(
      new AnalyticsApiModule.AnalyticsApi(configuration),
      auth,
    ),
    authentication: reactiveApi(
      new AuthenticationApiModule.AuthenticationApi(configuration),
      auth,
    ),
    health: reactiveApi(new HealthApiModule.HealthApi(configuration), auth),
    paymentMethods: reactiveApi(
      new PaymentMethodsApiModule.PaymentMethodsApi(configuration),
      auth,
    ),
    publicPaymentMethods: reactiveApi(
      new PublicPaymentMethodsApiModule.PublicPaymentMethodsApi(configuration),
      auth,
    ),
    publicSubscriptionsPlans: reactiveApi(
      new PublicSubscriptionsPlansApiModule.PublicSubscriptionsPlansApi(
        configuration,
      ),
      auth,
    ),
    publicURLs: reactiveApi(
      new PublicURLsApiModule.PublicURLsApi(configuration),
      auth,
    ),
    sessions: reactiveApi(
      new SessionsApiModule.SessionsApi(configuration),
      auth,
    ),
    subscriptions: reactiveApi(
      new SubscriptionsApiModule.SubscriptionsApi(configuration),
      auth,
    ),
    transactions: reactiveApi(
      new TransactionsApiModule.TransactionsApi(configuration),
      auth,
    ),
    urls: reactiveApi(new UrlsApiModule.UrlsApi(configuration), auth),
    user: reactiveApi(new UserApiModule.UserApi(configuration), auth),
  } as { [K in keyof EnvlinkApis]: ReactiveApi<EnvlinkApis[K]> };
}
