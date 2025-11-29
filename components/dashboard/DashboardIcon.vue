<script setup lang="ts">
import { computed } from "vue";
import { getCountryCode } from "countries-list";

const props = defineProps<{
  type: "browser" | "flag" | "platform" | "platform-os" | "referrer";
  name: string;
  code?: string;
  size?: string;
}>();

// --- Browser Icons ---
const browserIcons: Record<string, string> = {
  Chrome:
    "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/chrome/chrome_128x128.png",
  Firefox:
    "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/firefox/firefox_128x128.png",
  Safari:
    "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/safari/safari_128x128.png",
  Edge: "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/edge/edge_128x128.png",
  Opera:
    "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/opera/opera_128x128.png",
  Brave:
    "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/brave/brave_128x128.png",
  InternetExplorer:
    "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/archive/internet-explorer_9-11/internet-explorer_9-11_128x128.png",
  Yandex:
    "https://cdnjs.cloudflare.com/ajax/libs/browser-logos/74.1.0/yandex/yandex_128x128.png",
};

// --- Platform Icons ---
const platformIcons: Record<string, string> = {
  Desktop: "/icons/desktop.png",
  Mobile: "/icons/mobile.png",
  Tablet: "/icons/tablet.png",
};

// --- Platform OS Icons ---
const osIcons: Record<string, string> = {
  Windows:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/windows8/windows8-original.svg",
  macOS:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg",
  iOS: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apple/apple-original.svg",
  Android:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/android/android-original.svg",
  Linux:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
};

// --- Referrer Icons ---
const referrerIcons: Record<string, string> = {
  Google:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg",
  Facebook:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/facebook/facebook-original.svg",
  Twitter:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/twitter/twitter-original.svg",
  LinkedIn:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg",
  GitHub:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
  Youtube:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/youtube/youtube-original.svg",
  Direct: "/icons/globe.png",
};

const iconUrl = computed(() => {
  switch (props.type) {
    case "browser": {
      if (!props.name) return "";
      if (browserIcons[props.name]) return browserIcons[props.name];
      const lowerName = props.name.toLowerCase();
      const key = Object.keys(browserIcons).find(
        (k) => k.toLowerCase() === lowerName
      );
      return key ? browserIcons[key] : "";
    }
    case "flag": {
      let countryCode = props.code;
      if (!countryCode && props.name) {
        const code = getCountryCode(props.name);
        if (code && typeof code === "string") {
          countryCode = code;
        }
      }
      return countryCode
        ? `https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode.toUpperCase()}.svg`
        : "";
    }
    case "platform": {
      return platformIcons[props.name] || "";
    }
    case "platform-os": {
      return osIcons[props.name] || "";
    }
    case "referrer": {
      if (!props.name) return "";
      if (referrerIcons[props.name]) return referrerIcons[props.name];
      // Case-insensitive fallback
      const lowerName = props.name.toLowerCase();
      const key = Object.keys(referrerIcons).find(
        (k) => k.toLowerCase() === lowerName
      );
      return key ? referrerIcons[key] : "";
    }
    default:
      return "";
  }
});

const sizeClass = computed(() => {
  const size = props.size || "w-5 h-5";
  if (props.name === "referrer") {
    return "w-3 h-3";
  }
  return size;
});
</script>

<template>
  <img
    v-if="iconUrl"
    :src="iconUrl"
    :alt="`${name} icon`"
    :class="[sizeClass, 'shrink-0', 'object-contain']"
  />
  <div
    v-else
    :class="[
      sizeClass,
      'shrink-0 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-500',
    ]"
  >
    ?
  </div>
</template>
