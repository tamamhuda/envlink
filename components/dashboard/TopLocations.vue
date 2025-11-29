<script setup lang="ts">
import { ref, computed } from "vue";
import type { CountryVisitsData } from "~/client/src/generated/models/CountryVisitsData";
import type { CityVisitsData } from "~/client/src/generated/models/CityVisitsData";
import type { RegionVisitsData } from "~/client/src/generated/models/RegionVisitsData";
import DashboardIcon from "./DashboardIcon.vue";
import { getCountryData, type TCountryCode } from "countries-list";

const props = defineProps<{
  countryData: CountryVisitsData[];
  cityData: CityVisitsData[];
  regionData: RegionVisitsData[];
  totalVisits: number;
}>();

const activeTab = ref<"countries" | "cities" | "regions">("countries");

const displayedData = computed(() => {
  if (activeTab.value === "countries") {
    return props.countryData.map((item) => {
      return {
        name: getCountryData(item.countryCode as TCountryCode)?.name,
        country: item.countryCode,
        count: item.total || 0,
        percentage: props.totalVisits
          ? ((item.total || 0) / props.totalVisits) * 100
          : 0,
      };
    });
  } else if (activeTab.value === "cities") {
    return props.cityData.map((item) => ({
      name: `${item.city}, ${getCountryData(item.countryCode as TCountryCode)?.name}`,
      country: item.countryCode,
      count: item.total || 0,
      percentage: props.totalVisits
        ? ((item.total || 0) / props.totalVisits) * 100
        : 0,
    }));
  } else {
    return props.regionData.map((item) => ({
      name: item.region,
      country: "", // No country for regions in this context, or could be inferred if available
      count: item.total || 0,
      percentage: props.totalVisits
        ? ((item.total || 0) / props.totalVisits) * 100
        : 0,
    }));
  }
});
</script>

<template>
  <div class="box-inner-card w-full h-full min-h-[450px] p-6 flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">Top Locations</h3>
      <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          class="px-3 py-1 text-xs font-medium rounded-md transition-all"
          :class="{
            'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white':
              activeTab === 'countries',
            'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300':
              activeTab !== 'countries',
          }"
          @click="activeTab = 'countries'"
        >
          Countries
        </button>
        <button
          class="px-3 py-1 text-xs font-medium rounded-md transition-all"
          :class="{
            'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white':
              activeTab === 'cities',
            'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300':
              activeTab !== 'cities',
          }"
          @click="activeTab = 'cities'"
        >
          Cities
        </button>
        <button
          class="px-3 py-1 text-xs font-medium rounded-md transition-all"
          :class="{
            'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white':
              activeTab === 'regions',
            'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300':
              activeTab !== 'regions',
          }"
          @click="activeTab = 'regions'"
        >
          Regions
        </button>
      </div>
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
              <DashboardIcon
                v-if="activeTab === 'countries' || activeTab === 'cities'"
                type="flag"
                :name="item.country"
                :code="item.country"
                size="w-4 h-3"
                class="rounded-sm"
              />

              <div
                v-else
                class="w-4 h-3 bg-gray-200 dark:bg-gray-600 rounded-sm flex items-center justify-center text-[8px] text-gray-500 dark:text-gray-400"
              >
                R
              </div>
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
