/** @type {import('tailwindcss').Config} */
export default {
  darkMode:["class"],
  content: [
    "./pages/**/*.{html,js,vue,ts}",
    "./components/**/*.{html,js,vue,ts}",
    "./layouts/**/*.{html,js,vue,ts}",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Fira Code"', "monospace"],
      },
    },
  },
  plugins: [],
};
