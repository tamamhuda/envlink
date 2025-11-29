// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from "vite-tsconfig-paths";
// import colors from "tailwindcss/colors.js";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  css: ["~/assets/css/tailwind.css"],
  future: {
    compatibilityVersion: 4,
  },
  postcss: {
    plugins: {
      autoprefixer: {},
    },
  },
  sourcemap: false,
  devServer: {
    port: Number(process.env.PORT) || 3000,
    host: process.env.HOST || "0.0.0.0",
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
          innerHTML: `
            const theme = localStorage.getItem('theme') || 'dark';
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          `,
          tagPosition: "head",
        },
        {
          type: "text/javascript",
          src: "https://js.xendit.co/v3/xendit.min.js",
        },
        {
          src: "https://accounts.google.com/gsi/client",
          async: true,
          defer: true,
        },
      ],
    },
  },

  vite: {
    plugins: [tsconfigPaths(), tailwindcss()],
    server: {
      allowedHosts: ["local.envlink.one"],
    },
  },
  build: {
    transpile: ["vue3-apexcharts"],
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: ["@nuxt/eslint", "@nuxt/image", "@pinia/nuxt"],

  pages: true,
  imports: {
    autoImport: false,
  },
  pinia: {
    storesDirs: ["auth", "subscriptions", "payment-methods", "sessions"],
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.ENVLINK_API_URL || "http://localhost:8000",
      appUrl: process.env.APP_URL || "http://localhost:3000",
      xendit: {
        publicKey: process.env.XENDIT_PUBLIC_KEY || "",
        paymentMethodRedirectUrl: process.env.PAYMENT_METHOD_REDIRECT_URL || "",
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
      },
    },
  },
});
