import type { Ref } from "vue";
import type { Configuration, ErrorResponse, Tokens } from "../generated";

export interface AuthConfig {
  getTokens: () => Promise<Tokens> | Tokens | null;
  setTokens: (tokens: Tokens) => Promise<void> | void;
  onRefreshFailed?: () => void; // optional callback if refresh fails
}

export type ReactiveReturningKeys =
  | "withMiddleware"
  | "withPreMiddleware"
  | "withPostMiddleware"
  | "clone";

export type ApiMethod<T extends (...args: any[]) => any> = {
  execute: (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | null>;
  pending: Ref<boolean>;
  error: Ref<ErrorResponse | null>;
  response: Ref<Awaited<ReturnType<T>> | null>;
};

export type ReactiveApi<T extends object> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? K extends ReactiveReturningKeys
      ? (...args: Parameters<T[K]>) => ReactiveApi<T>
      : () => ApiMethod<T[K]>
    : T[K];
};

export interface EnvlinkClientOptions {
  config: Configuration;
  auth?: AuthConfig;
  onError?: (ctx: EnvlinkErrorContext) => void | Promise<void>;
}

export interface EnvlinkErrorContext {
  type: "NETWORK_ERROR" | "UNAUTHORIZED" | "REFRESH_FAILED" | "API_ERROR";
  error: unknown;
  status?: number;
  endpoint: string;
  method: string;
}

/** * Methods that return a new API instance and therefore * must also return a wrapped API. */
type WrapReturningKeys =
  | "withMiddleware"
  | "withPreMiddleware"
  | "withPostMiddleware"
  | "clone";

/** * Transform an API instance into a wrapped API instance. */
export type WrappedApi<T extends object> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? K extends WrapReturningKeys
      ? (...args: Parameters<T[K]>) => WrappedApi<T>
      : () => ApiMethod<T[K]>
    : T[K];
};
