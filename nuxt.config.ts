// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from "vite-tsconfig-paths";
export default defineNuxtConfig({
  devServer: {
    port: Number(process.env.PORT) || 3000,
    host: "0.0.0.0",
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap",
        },
      ],
      script: [
        {
          type: "text/javascript",
          src: "https://js.xendit.co/v3/xendit.min.js",
        },
      ],
    },
  },

  vite: {
    plugins: [tsconfigPaths()],
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
  ],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  pages: true,
  imports: {
    autoImport: false,
  },
  pinia: {
    storesDirs: ["auth", "subscription"],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.ENVLINK_API_URL || "http://localhost:3000",
      appUrl: process.env.APP_URL || "http://localhost:4000",
      xendit: {
        publicKey: process.env.XENDIT_PUBLIC_KEY || "",
        paymentMethodRedirectUrl: process.env.PAYMENT_METHOD_REDIRECT_URL || "",
      },
    },
  },
});
