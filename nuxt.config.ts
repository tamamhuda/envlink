// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from "vite-tsconfig-paths";
export default defineNuxtConfig({
  devServer: {
    port: 4000,
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
  runtimeConfig: {
    public: {
      apiBase: process.env.ENVLINK_API_URL || "http://localhost:3000",
    },
  },
});
