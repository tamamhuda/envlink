<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, computed } from "vue";
import type { CountryVisitsData } from "~/client/src/generated/models/CountryVisitsData";
import { useNuxtApp } from "#app";

const { $jsVectorMap } = useNuxtApp();

const props = defineProps<{
  data: CountryVisitsData[];
  isDarkMode: boolean;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: any = null;

const mapData = computed(() => {
  const data: Record<string, number> = {};
  props.data.forEach((item) => {
    const code = item.countryCode;
    if (code) {
      data[code] = item.total || 0;
    }
  });
  return data;
});

const initMap = () => {
  if (!mapContainer.value) return;

  // Clean up existing map
  if (map) {
    map.destroy();
    map = null;
  }

  // Manually clear container to prevent duplicates
  if (mapContainer.value) {
    mapContainer.value.innerHTML = "";
  }

  const isDark = props.isDarkMode;
  const bgColor = "transparent";
  const regionColor = isDark ? "#374151" : "#e5e7eb";
  const hoverColor = isDark ? "#4b5563" : "#d1d5db";
  const selectedColor = "#2563eb";

  map = new $jsVectorMap({
    selector: mapContainer.value,
    map: "world",
    backgroundColor: bgColor,
    zoomButtons: true,
    zoomOnScroll: false,
    regionStyle: {
      initial: {
        fill: regionColor,
        stroke: "none",
        strokeWidth: 0,
        strokeOpacity: 1,
      },
      hover: {
        fill: hoverColor,
        cursor: "pointer",
      },
      selected: {
        fill: selectedColor,
      },
      selectedHover: {},
    },
    visualizeData: {
      scale: ["#93c5fd", "#1d4ed8"], // Blue scale
      values: mapData.value,
    },
    onRegionTooltipShow(event: any, tooltip: any, code: string) {
      const count = mapData.value[code] || 0;
      if (count > 0) {
        tooltip.text(
          `
          <div class="text-xs font-semibold">${tooltip.text()}</div>
          <div class="text-xs">Visits: ${count}</div>
          `,
          true // Enable HTML
        );
      }
    },
  });
};

watch(
  () => [props.data, props.isDarkMode],
  () => {
    initMap();
  },
  { deep: true }
);

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map) {
    map.destroy();
  }
});
</script>

<template>
  <div
    class="box-inner-card w-full h-full min-h-[450px] p-6 relative overflow-hidden"
  >
    <h3 class="text-lg font-semibold mb-4">Visits by Country</h3>
    <div ref="mapContainer" class="w-full h-full"></div>
  </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

:deep(.jvm-tooltip) {
  @apply bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg rounded px-2 py-1 text-xs font-sans z-50;
}
</style>
