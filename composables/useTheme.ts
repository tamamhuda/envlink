import { ref, onMounted, onUnmounted } from "vue";

export function useTheme(defaultMode: "dark" | "light" = "dark") {
  // SSR-safe initial state. Do NOT use document here.
  const isDarkMode = ref(defaultMode === "dark");

  // Hydration-safe guard (useful for UI that depends on theme)
  const themeReady = ref(false);

  let observer: MutationObserver | null = null;

  const applyTheme = (mode: "dark" | "light") => {
    if (typeof window === "undefined") return;

    localStorage.setItem("theme", mode);

    const root = document.documentElement;

    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    isDarkMode.value = mode === "dark";
  };

  const toggleTheme = () => {
    applyTheme(isDarkMode.value ? "light" : "dark");
  };

  onMounted(() => {
    const root = document.documentElement;

    // Read already-applied script-injected theme (prevents flashing)
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;

    const resolved = stored
      ? stored
      : root.classList.contains("dark")
        ? "dark"
        : "light";

    applyTheme(resolved);

    themeReady.value = true;

    // Observe external class changes (if any)
    observer = new MutationObserver(() => {
      isDarkMode.value = root.classList.contains("dark");
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });

  onUnmounted(() => observer?.disconnect());

  return {
    isDarkMode,
    themeReady,
    toggleTheme,
    setTheme: applyTheme,
  };
}
