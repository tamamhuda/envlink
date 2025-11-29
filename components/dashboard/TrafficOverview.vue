<script setup lang="ts">
import { ref, computed } from "#imports";
import { Calendar, MousePointerClick, Globe, BarChart2 } from "lucide-vue-next";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import type { UrlAnalyticsOverview } from "~/client/src/generated/models/UrlAnalyticsOverview";
import type { UrlAnalyticTimeline } from "~/client/src/generated/models/UrlAnalyticTimeline";
import { getCountryData, type TCountryCode } from "countries-list";

const props = withDefaults(
  defineProps<{
    timelineData: UrlAnalyticTimeline[];
    analyticsOverview: UrlAnalyticsOverview;
    isDarkMode: boolean;
    switchable?: boolean;
    defaultMode?: "area" | "bar";
    columnData?: UrlAnalyticTimeline[];
  }>(),
  {
    switchable: false,
    defaultMode: "area",
    columnData: undefined,
  }
);

const activeChartMode = ref<"area" | "bar">(props.defaultMode);

// Traffic Overview date range state
const trafficDateRange = ref<Date[]>([
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  new Date(), // today
]);

// Filtered timeline data based on date range
const filteredTimelineData = computed(() => {
  if (!trafficDateRange.value || trafficDateRange.value.length !== 2) {
    return props.timelineData;
  }

  const startDate = trafficDateRange.value[0];
  const endDate = trafficDateRange.value[1];

  if (!startDate || !endDate) return props.timelineData;

  return props.timelineData.filter((item) => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= startDate && itemDate <= endDate;
  });
});

// Chart Options
const chartOptions = computed(() => {
  const isDark = props.isDarkMode;
  const textColor = isDark ? "#e5e7eb" : "#374151";
  const gridColor = isDark ? "#374151" : "#e5e7eb";
  const isBar = activeChartMode.value === "bar";

  if (isBar) {
    return {
      chart: {
        id: "visits-bar",
        type: "bar",
        toolbar: { show: false },
        fontFamily: "inherit",
        background: "transparent",
      },
      colors: ["#2563eb"],
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return val > 0 ? val.toLocaleString() : "";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: [textColor],
        },
      },
      xaxis: {
        categories:
          props.columnData?.map((d) =>
            d.timestamp.toLocaleDateString(undefined, { month: "short" })
          ) || [],
        position: "top",
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: { enabled: true },
        labels: {
          style: { colors: textColor },
        },
      },
      yaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          show: false,
          formatter: function (val: number) {
            return val.toLocaleString();
          },
        },
      },
      grid: {
        show: false,
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
      },
    };
  }

  return {
    chart: {
      id: "visits-timeline",
      type: "area",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      fontFamily: "inherit",
      background: "transparent",
    },
    colors: ["#2563eb", "#10b981"], // Blue for Total, Green for Unique
    stroke: {
      curve: "smooth" as const,
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: filteredTimelineData.value.map((d) =>
        d.timestamp.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      ),
      labels: {
        style: {
          colors: textColor,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: textColor,
        },
      },
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    tooltip: {
      theme: isDark ? "dark" : "light",
      x: {
        show: false,
      },
    },
    legend: {
      labels: {
        colors: textColor,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
  };
});

// Chart Series
const chartSeries = computed(() => {
  if (activeChartMode.value === "bar" && props.columnData) {
    return [
      {
        name: "Total Visits",
        data: props.columnData.map((d) => d.totalVisits),
      },
    ];
  }

  return [
    {
      name: "Total Visits",
      data: filteredTimelineData.value.map((d) => d.totalVisits),
    },
    {
      name: "Unique Visits",
      data: filteredTimelineData.value.map((d) => d.uniqueVisits),
    },
  ];
});
</script>

<template>
  <div class="box-inner-card p-6">
    <div class="flex flex-col gap-6 mb-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <h2 class="text-xl font-semibold">Traffic Overview</h2>

        <div class="flex flex-col sm:flex-row gap-4 items-center">
          <!-- Date Range Picker -->
          <div class="w-full sm:w-auto min-w-[250px]">
            <VueDatePicker
              v-model="trafficDateRange"
              range
              multi-calendars
              :enable-time-picker="false"
              :is-24="true"
              format="MMM dd, yyyy"
              placeholder="Select date range"
              :clearable="false"
              auto-apply
              :dark="isDarkMode"
              menu-class-name="dp-custom-menu"
            >
              <template #trigger>
                <div class="relative cursor-pointer">
                  <Calendar
                    class="absolute left-3 top-2.5 h-4 w-4 opacity-50 pointer-events-none z-20"
                  />
                  <input
                    type="text"
                    readonly
                    :value="
                      trafficDateRange &&
                      trafficDateRange[0] &&
                      trafficDateRange[1]
                        ? `${trafficDateRange[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${trafficDateRange[1].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                        : 'Select date range'
                    "
                    class="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </template>
            </VueDatePicker>
          </div>

          <!-- Chart Mode Switcher -->
          <div
            v-if="switchable"
            class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
          >
            <button
              class="px-3 py-1 text-xs font-medium rounded-md transition-all"
              :class="{
                'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white':
                  activeChartMode === 'area',
                'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300':
                  activeChartMode !== 'area',
              }"
              @click="activeChartMode = 'area'"
            >
              Area
            </button>
            <button
              class="px-3 py-1 text-xs font-medium rounded-md transition-all"
              :class="{
                'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white':
                  activeChartMode === 'bar',
                'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300':
                  activeChartMode !== 'bar',
              }"
              @click="activeChartMode = 'bar'"
            >
              Column
            </button>
          </div>
        </div>
      </div>

      <!-- Inline Analytics Stats -->
      <div class="w-full grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8">
        <div
          class="flex items-center gap-3 p-4 rounded-lg bg-gray-200/40 dark:bg-white/5 border border-gray-200 dark:border-gray-700"
        >
          <div
            class="w-10 h-10 rounded-md bg-(--inner-shadow-color) dark:bg-gray-700 flex items-center justify-center shrink-0"
          >
            <MousePointerClick class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="text-xs opacity-80">Total Visits</p>
            <p class="text-lg font-bold truncate">
              {{ analyticsOverview.totalVisits?.toLocaleString() || 0 }}
            </p>
          </div>
        </div>
        <div
          class="flex items-center gap-3 p-4 rounded-lg bg-gray-200/40 dark:bg-white/5 border border-gray-200 dark:border-gray-700"
        >
          <div
            class="w-10 h-10 rounded-md bg-(--inner-shadow-color) dark:bg-gray-700 flex items-center justify-center shrink-0"
          >
            <Globe class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="text-xs opacity-80">Top Location</p>
            <p class="text-lg font-bold truncate">
              {{
                analyticsOverview.topCountries?.[0]?.countryCode
                  ? getCountryData(
                      analyticsOverview.topCountries?.[0]
                        ?.countryCode as TCountryCode
                    ).name || "No Data"
                  : "No Data"
              }}
            </p>
          </div>
        </div>
        <div
          class="flex items-center gap-3 p-4 rounded-lg bg-gray-200/40 dark:bg-white/5 border border-gray-200 dark:border-gray-700"
        >
          <div
            class="w-10 h-10 rounded-md bg-(--inner-shadow-color) dark:bg-gray-700 flex items-center justify-center shrink-0"
          >
            <BarChart2 class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <p class="text-xs opacity-80">Top Link</p>
            <p class="text-lg font-bold truncate">
              {{
                analyticsOverview.topUrls?.[0]?.url?.originalUrl || "No Data"
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full h-[300px]">
      <ClientOnly>
        <apexchart
          width="100%"
          height="100%"
          :type="activeChartMode"
          :options="chartOptions"
          :series="chartSeries"
        ></apexchart>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
/* Date Picker Custom Styles */
:deep(.dp__main) {
  font-family: inherit;
}

:deep(.dp__input_wrap) {
  width: 100%;
}

:deep(.dp__input) {
  border: none !important;
  padding: 0 !important;
  background: transparent !important;
  color: inherit !important;
}

:deep(.dp__clear_icon) {
  right: 12px !important;
}

:deep(.dp__input_icon) {
  display: none;
}

/* Custom menu style for datepicker */
:deep(.dp-custom-menu) {
  /* Custom variables for both light and dark mode */
  --dp-background-color: var(--bg-color);
  --dp-text-color: var(--text-color);
  --dp-font-family: inherit;
  --dp-border-radius: 0.5rem; /* rounded-lg */
  --dp-primary-color: #2563eb; /* blue-600 */
  --dp-primary-text-color: #ffffff;
  --dp-border-color: transparent; /* The menu itself will have a border */

  /* Custom border and shadow to match project style */
  border: 2px solid var(--text-color);
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1); /* shadow-lg */
}

/* Light mode specific overrides */
:deep(.dp-custom-menu:not(.dp--dark)) {
  --dp-hover-color: #eff6ff; /* blue-50 */
  --dp-hover-text-color: var(--text-color);
  --dp-icon-color: var(--text-color);
  --dp-secondary-color: #a6a6a6;
}

/* Dark mode specific overrides */
:deep(.dp-custom-menu.dp--dark) {
  --dp-hover-color: #1e3a8a33; /* approx. blue-900 with 20% opacity */
  --dp-hover-text-color: var(--text-color);
  --dp-icon-color: var(--text-color);
  --dp-secondary-color: #757575;
}
</style>
