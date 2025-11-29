<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "#imports";
import { Calendar, MousePointerClick, Globe, BarChart2 } from "lucide-vue-next";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import type { UrlAnalyticsOverview } from "~/client/src/generated/models/UrlAnalyticsOverview";
import type { UrlAnalyticTimeline } from "~/client/src/generated/models/UrlAnalyticTimeline";
import { getCountryData, type TCountryCode } from "countries-list";
import ActionDropdown from "~/components/common/ActionDropdown.vue";

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
const isDatePickerOpen = ref(false);
const datePickerRef = ref<HTMLElement | null>(null);

// Traffic Overview date range state
const trafficDateRange = ref<Date[]>([
  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  new Date(), // today
]);

// Handle click outside to close date picker
const handleClickOutside = (event: MouseEvent) => {
  if (
    datePickerRef.value &&
    !datePickerRef.value.contains(event.target as Node)
  ) {
    isDatePickerOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

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
          <!-- Date Range Picker with ActionDropdown -->
          <div ref="datePickerRef">
            <ActionDropdown
              :is-open="isDatePickerOpen"
              dropdown-class="w-auto"
              @toggle="isDatePickerOpen = !isDatePickerOpen"
              @close="isDatePickerOpen = false"
            >
              <template #trigger>
                <button
                  type="button"
                  class="w-full sm:w-auto min-w-[250px] flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                >
                  <Calendar class="h-4 w-4 opacity-50" />
                  <span>
                    {{
                      trafficDateRange &&
                      trafficDateRange[0] &&
                      trafficDateRange[1]
                        ? `${trafficDateRange[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${trafficDateRange[1].toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
                        : "Select date range"
                    }}
                  </span>
                </button>
              </template>

              <div class="p-2">
                <VueDatePicker
                  v-model="trafficDateRange"
                  range
                  inline
                  multi-calendars
                  :enable-time-picker="false"
                  :dark="isDarkMode"
                  auto-apply
                />
              </div>
            </ActionDropdown>
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
@reference "../../assets/css/tailwind.css";

/* Date Picker Inline Mode Styles */
:deep(.dp__main) {
  font-family: inherit;
  background-color: var(--bg-color);
  border-radius: 0.5rem;
}

:deep(.dp__calendar) {
  font-family: inherit;
}

/* Remove default borders and shadows */
:deep(.dp__menu) {
  border: none !important;
  box-shadow: none !important;
  background: transparent !important;
}

/* Calendar styling */
:deep(.dp__calendar_header) {
  color: var(--text-color);
  font-weight: 600;
}

:deep(.dp__calendar_header_item) {
  color: var(--text-color);
  opacity: 0.7;
}

:deep(.dp__calendar_item) {
  color: var(--text-color);
}

/* Action row (bottom buttons) */
:deep(.dp__action_row) {
  display: none; /* Hide since we're using auto-apply */
}

/* Selected date styling - match box-shadow-card pattern */
:deep(.dp__range_start),
:deep(.dp__range_end),
:deep(.dp__active_date) {
  background: var(--primary-color) !important;
  color: #fff !important;
}

/* Dark mode selected dates */
:deep(.dp--dark .dp__range_start),
:deep(.dp--dark .dp__range_end),
:deep(.dp--dark .dp__active_date) {
  background: var(--date-range-color) !important;
  border: 1px solid var(--border-color) !important;
  color: #fff !important;
}

/* Hover effect on selected dates - reduce shadow like card hover */
:deep(.dp__range_start:hover),
:deep(.dp__range_end:hover),
:deep(.dp__active_date:hover) {
  background: rgba(86, 48, 252, 0.3) !important;
  color: var(--text-color) !important;
}

:deep(.dp--dark .dp__range_start:hover),
:deep(.dp--dark .dp__range_end:hover),
:deep(.dp--dark .dp__active_date:hover) {
  background: rgba(86, 48, 252, 0.3) !important;
  color: var(--text-color) !important;
}

/* Range between dates - subtle styling */
:deep(.dp__range_between) {
  background: var(--date-range-color) !important;
  color: var(--date-text-range-color) !important;
  border: 0 !important;
  border-radius: 0 !important;
}

:deep(.dp--dark .dp__range_between) {
  background: rgba(86, 48, 252, 0.3) !important;
  color: var(--text-color) !important;
}

/* Today's date with border (not selected) */
:deep(
  .dp__today:not(.dp__range_start):not(.dp__range_end):not(.dp__active_date)
) {
  background: var(--primary-color) !important;
  color: #fff !important;
}

/* Hover state for non-selected dates */
:deep(.dp__cell_inner:hover) {
  background: var(--primary-color) !important;
  color: #fff !important;
}

:deep(.dp--dark .dp__cell_inner:hover) {
  background: rgba(30, 58, 138, 0.2) !important;
}

/* Month/Year navigation buttons */
:deep(.dp__btn) {
  color: var(--text-color) !important;
}

:deep(.dp__inner_nav:hover) {
  background: transparent !important;
  color: var(--text-color) !important;
  border-radius: 3px !important;
}

:deep(.dp__btn:hover) {
  background: var(--date-button-color) !important;
  color: var(--text-color) !important;
  border-radius: 3px !important;
}

:deep(.dp--dark .dp__btn:hover) {
  background: rgba(30, 58, 138, 0.2) !important;
}
</style>
