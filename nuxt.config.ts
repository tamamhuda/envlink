// https://nuxt.com/docs/api/configuration/nuxt-config
import tsconfigPaths from "vite-tsconfig-paths";
export default defineNuxtConfig({
  app: {
    head: {
      title: "Stativio — Abstract System Awareness",
      meta: [
        { name: "description", content: "Conscious systems in observation." },
      ],
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

  modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "@nuxtjs/tailwindcss"],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },
});
