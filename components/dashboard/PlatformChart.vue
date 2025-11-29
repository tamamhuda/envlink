<script setup lang="ts">
import { computed } from "vue";
import type { UrlAnalyticsSegmentsDeviceVisitsValue } from "~/client/src/generated/models/UrlAnalyticsSegmentsDeviceVisitsValue";

const props = defineProps<{
  title: string;
  data: Record<string, UrlAnalyticsSegmentsDeviceVisitsValue>;
  isDarkMode: boolean;
}>();

// Calculate total visits for percentage
const totalVisits = computed(() => {
  return Object.values(props.data).reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );
});

// Prepare chart data
const chartSeries = computed(() => {
  return Object.values(props.data).map((item) => item.total || 0);
});

const chartLabels = computed(() => {
  return Object.keys(props.data);
});

// Chart options
const chartOptions = computed(() => {
  const isDark = props.isDarkMode;
  const textColor = isDark ? "#e5e7eb" : "#374151";

  return {
    chart: {
      type: "pie",
      fontFamily: "inherit",
      background: "transparent",
    },
    labels: chartLabels.value,
    colors: ["#1e3a8a", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"],
    theme: {
      monochrome: {
        enabled: true,
        color: "#3b82f6",
        shadeTo: "light",
        shadeIntensity: 0.65,
      },
    },
    legend: {
      position: "bottom" as const,
      labels: {
        colors: textColor,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
      },
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (value: number) => {
          const percentage = ((value / totalVisits.value) * 100).toFixed(1);
          return `${value.toLocaleString()} (${percentage}%)`;
        },
      },
    },
  };
});
</script>

<template>
  <div class="box-inner-card w-full h-full min-h-[450px] p-6 flex flex-col">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <div class="flex-1 flex items-center justify-center">
      <ClientOnly>
        <apexchart
          width="100%"
          height="350"
          type="pie"
          :options="chartOptions"
          :series="chartSeries"
        ></apexchart>
      </ClientOnly>
    </div>
  </div>
</template>
