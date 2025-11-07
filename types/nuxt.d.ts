import type { useFetch } from "#app";
import type { FetchOptions } from "ofetch";
// import type { NuxtApp } from "#app";

declare module "#app" {
  interface NuxtApp {
    $api: <T = unknown>(
      url: string,
      options?: FetchOptions<"json">,
    ) => Promise<T>;
    $useApi: <T = unknown>(
      url: string,
      options?: UseFetchOptions<"json">["$fetch"],
    ) => Promise<ReturnType<typeof useFetch<T>>>;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $api: <T = unknown>(url: string, options?: FetchOptions) => Promise<T>;
    $useFetch: <T = unknown>(
      url: string,
      options?: UseFetchOptions<"json">["$fetch"],
    ) => Promise<ReturnType<typeof useFetch<T>>>;
  }
}
