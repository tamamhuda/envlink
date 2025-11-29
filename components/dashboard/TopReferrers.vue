<script setup lang="ts">
import { computed } from "vue";
import type { UrlAnalyticsSegmentsDeviceVisitsValue } from "~/client/src/generated/models/UrlAnalyticsSegmentsDeviceVisitsValue";
import DashboardIcon from "./DashboardIcon.vue";

const props = defineProps<{
  referrerData: Record<string, UrlAnalyticsSegmentsDeviceVisitsValue>;
}>();

// Calculate total visits
const totalVisits = computed(() => {
  return Object.values(props.referrerData).reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );
});

const displayedData = computed(() => {
  return Object.entries(props.referrerData).map(([name, value]) => ({
    name: name || "Direct", // Handle empty referrer as Direct
    count: value.total || 0,
    percentage: totalVisits.value
      ? ((value.total || 0) / totalVisits.value) * 100
      : 0,
  }));
});
</script>

<template>
  <div class="box-inner-card w-full h-full min-h-[450px] p-6 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">Top Referrers</h3>
    </div>

    <div class="flex-1 overflow-y-auto pr-2 space-y-4">
      <div
        v-for="(item, index) in displayedData"
        :key="index"
        class="flex items-center justify-between group"
      >
        <div class="flex-1 min-w-0 mr-4">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2 min-w-0">
              <DashboardIcon type="referrer" :name="item.name" size="w-5 h-5" />
              <span class="text-sm font-medium truncate">{{ item.name }}</span>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 ml-2">
              <span class="font-semibold text-gray-900 dark:text-white">{{
                item.count.toLocaleString()
              }}</span>
              <span class="ml-1">({{ item.percentage.toFixed(2) }}%)</span>
            </div>
          </div>
          <div class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
            <div
              class="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              :style="{ width: `${item.percentage}%` }"
            ></div>
          </div>
        </div>
      </div>
      <div
        v-if="displayedData.length === 0"
        class="flex items-center justify-center h-full text-sm text-gray-500"
      >
        No data available
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

/* Custom scrollbar for the list */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(107, 114, 128, 0.8);
}
</style>
