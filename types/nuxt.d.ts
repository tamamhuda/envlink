import type { FetchOptions } from "ofetch";
// import type { NuxtApp } from "#app";

declare module "#app" {
  interface NuxtApp {
    $api: <T = unknown>(url: string, options?: FetchOptions) => Promise<T>;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $api: <T = unknown>(url: string, options?: FetchOptions) => Promise<T>;
  }
}
