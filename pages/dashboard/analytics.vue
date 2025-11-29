<template>
  <Content :is-ready="true">
    <div class="grid grid-cols-1 xl:grid-cols-4 min-w-full gap-8">
      <div class="col-span-4">
        <TrafficOverview
          :timeline-data="timelineData"
          :analytics-overview="analyticsOverview"
          :is-dark-mode="isDarkMode"
          :switchable="true"
          default-mode="bar"
          :column-data="monthlyTimelineData"
        />
      </div>
      <div class="col-span-4 xl:col-span-2">
        <WorldMap :data="countryVisits" :is-dark-mode="isDarkMode" />
      </div>
      <div class="col-span-4 xl:col-span-2">
        <TopLocations
          :country-data="countryVisits"
          :city-data="cityVisits"
          :region-data="regionVisits"
          :total-visits="analyticsOverview.totalVisits || 0"
        />
      </div>

      <div class="col-span-4 xl:col-span-2">
        <PlatformChart
          title="Platforms"
          :data="deviceVisits"
          :is-dark-mode="isDarkMode"
        />
      </div>
      <div class="col-span-4 xl:col-span-2">
        <TopPlatforms :device-data="deviceVisits" :os-data="osVisits" />
      </div>
      <div class="col-span-4 xl:col-span-2">
        <PlatformChart
          title="Browsers"
          :data="browserVisits"
          :is-dark-mode="isDarkMode"
        />
      </div>
      <div class="col-span-4 xl:col-span-2">
        <TopBrowsers :browser-data="browserVisits" />
      </div>
      <div class="col-span-4 xl:col-span-2">
        <PlatformChart
          title="Referrers"
          :data="referrerVisits"
          :is-dark-mode="isDarkMode"
        />
      </div>
      <div class="col-span-4 xl:col-span-2">
        <TopReferrers :referrer-data="referrerVisits" />
      </div>
    </div>
  </Content>
</template>

<script setup lang="ts">
import { definePageMeta, ref, onMounted, onUnmounted } from "#imports";
import Content from "~/components/Content.vue";
import TrafficOverview from "~/components/dashboard/TrafficOverview.vue";
import WorldMap from "~/components/dashboard/WorldMap.vue";
import TopLocations from "~/components/dashboard/TopLocations.vue";
import PlatformChart from "~/components/dashboard/PlatformChart.vue";
import TopPlatforms from "~/components/dashboard/TopPlatforms.vue";
import TopBrowsers from "~/components/dashboard/TopBrowsers.vue";
import TopReferrers from "~/components/dashboard/TopReferrers.vue";
import type { UrlAnalyticsOverview } from "~/client/src/generated/models/UrlAnalyticsOverview";
import type { UrlAnalyticTimeline } from "~/client/src/generated/models/UrlAnalyticTimeline";
import type { CountryVisitsData } from "~/client/src/generated/models/CountryVisitsData";
import type { CityVisitsData } from "~/client/src/generated/models/CityVisitsData";
import type { RegionVisitsData } from "~/client/src/generated/models/RegionVisitsData";
import type { UrlAnalyticsSegmentsDeviceVisitsValue } from "~/client/src/generated/models/UrlAnalyticsSegmentsDeviceVisitsValue";

definePageMeta({
  layout: "dashboard",
});

// Dark mode state
const isDarkMode = ref(false);
let observer: MutationObserver | null = null;

onMounted(() => {
  const checkDarkMode = () => {
    isDarkMode.value = document.documentElement.classList.contains("dark");
  };

  observer = new MutationObserver(checkDarkMode);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  checkDarkMode();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// Dummy Data
const countryVisits = ref<CountryVisitsData[]>([
  { countryCode: "US", total: 4500, unique: 3000 },
  { countryCode: "DE", total: 2100, unique: 1500 },
  { countryCode: "GB", total: 1200, unique: 800 },
  { countryCode: "IN", total: 800, unique: 500 },
  { countryCode: "BR", total: 600, unique: 400 },
  { countryCode: "CA", total: 500, unique: 300 },
  { countryCode: "FR", total: 450, unique: 250 },
  { countryCode: "AU", total: 300, unique: 200 },
]);

const cityVisits = ref<CityVisitsData[]>([
  { city: "Jakarta", countryCode: "ID", total: 9, unique: 5 },
  { city: "Tangerang", countryCode: "ID", total: 9, unique: 4 },
  { city: "Belendung", countryCode: "ID", total: 7, unique: 3 },
  { city: "Unknown", countryCode: "Unknown", total: 3, unique: 1 },
  { city: "New York", countryCode: "US", total: 1200, unique: 800 },
  { city: "London", countryCode: "GB", total: 800, unique: 500 },
  { city: "Berlin", countryCode: "DE", total: 600, unique: 400 },
  { city: "Tokyo", countryCode: "JP", total: 500, unique: 300 },
]);

const regionVisits = ref<RegionVisitsData[]>([
  { region: "California", total: 1200, unique: 800 },
  { region: "New York", total: 800, unique: 500 },
  { region: "Texas", total: 600, unique: 400 },
  { region: "Florida", total: 500, unique: 300 },
  { region: "Illinois", total: 450, unique: 250 },
  { region: "Pennsylvania", total: 300, unique: 200 },
  { region: "Ohio", total: 200, unique: 150 },
  { region: "Georgia", total: 150, unique: 100 },
]);

const deviceVisits = ref<Record<string, UrlAnalyticsSegmentsDeviceVisitsValue>>(
  {
    Desktop: { total: 5200, unique: 3800 },
    Mobile: { total: 4800, unique: 3200 },
    Tablet: { total: 2543, unique: 1932 },
  }
);

const osVisits = ref<Record<string, UrlAnalyticsSegmentsDeviceVisitsValue>>({
  Windows: { total: 4500, unique: 3200 },
  macOS: { total: 3200, unique: 2400 },
  iOS: { total: 2800, unique: 2000 },
  Android: { total: 2043, unique: 1532 },
  Linux: { total: 500, unique: 300 },
});

const browserVisits = ref<
  Record<string, UrlAnalyticsSegmentsDeviceVisitsValue>
>({
  Chrome: { total: 6200, unique: 4500 },
  Firefox: { total: 2800, unique: 2000 },
  Safari: { total: 2100, unique: 1600 },
  Edge: { total: 1543, unique: 1100 },
  Opera: { total: 400, unique: 250 },
});

const referrerVisits = ref<
  Record<string, UrlAnalyticsSegmentsDeviceVisitsValue>
>({
  Google: { total: 4500, unique: 3200 },
  Direct: { total: 3500, unique: 2800 },
  Facebook: { total: 2100, unique: 1500 },
  Twitter: { total: 1200, unique: 800 },
  LinkedIn: { total: 800, unique: 500 },
  GitHub: { total: 600, unique: 400 },
});

const timelineData = ref<UrlAnalyticTimeline[]>([
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    totalVisits: 120,
    uniqueVisits: 80,
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    totalVisits: 150,
    uniqueVisits: 100,
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    totalVisits: 180,
    uniqueVisits: 120,
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    totalVisits: 200,
    uniqueVisits: 140,
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    totalVisits: 250,
    uniqueVisits: 180,
  },
  {
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    totalVisits: 300,
    uniqueVisits: 220,
  },
  {
    timestamp: new Date(),
    totalVisits: 280,
    uniqueVisits: 200,
  },
]);

const monthlyTimelineData = ref<UrlAnalyticTimeline[]>([
  {
    timestamp: new Date("2025-01-01"),
    totalVisits: 2300,
    uniqueVisits: 1500,
  },
  {
    timestamp: new Date("2025-02-01"),
    totalVisits: 3100,
    uniqueVisits: 2100,
  },
  {
    timestamp: new Date("2025-03-01"),
    totalVisits: 4000,
    uniqueVisits: 2800,
  },
  {
    timestamp: new Date("2025-04-01"),
    totalVisits: 10100,
    uniqueVisits: 7500,
  },
  {
    timestamp: new Date("2025-05-01"),
    totalVisits: 4000,
    uniqueVisits: 2900,
  },
  {
    timestamp: new Date("2025-06-01"),
    totalVisits: 3600,
    uniqueVisits: 2400,
  },
  {
    timestamp: new Date("2025-07-01"),
    totalVisits: 3200,
    uniqueVisits: 2100,
  },
  {
    timestamp: new Date("2025-08-01"),
    totalVisits: 2300,
    uniqueVisits: 1600,
  },
  {
    timestamp: new Date("2025-09-01"),
    totalVisits: 1400,
    uniqueVisits: 900,
  },
  {
    timestamp: new Date("2025-10-01"),
    totalVisits: 800,
    uniqueVisits: 500,
  },
  {
    timestamp: new Date("2025-11-01"),
    totalVisits: 500,
    uniqueVisits: 300,
  },
  {
    timestamp: new Date("2025-12-01"),
    totalVisits: 200,
    uniqueVisits: 100,
  },
]);

const analyticsOverview = ref<UrlAnalyticsOverview>({
  totalVisits: 12543,
  uniqueVisitors: 8932,
  topCountries: [
    { countryCode: "US", totalVisits: 4500 },
    { countryCode: "DE", totalVisits: 2100 },
  ],
  topUrls: [
    {
      url: {
        id: "1",
        code: "abcde",
        originalUrl: "envlink.one/promo",
        channels: [],
        metadata: {},
      },
      totalVisit: 3200,
      uniqueVisitors: 1500,
      firstVisit: new Date(),
      lastVisit: new Date(),
      deviceVisits: {},
      osVisits: {},
    },
    {
      url: {
        id: "2",
        code: "fghij",
        originalUrl: "https://mysite.com/blog",
        channels: [],
        metadata: {},
      },
      totalVisit: 1500,
      uniqueVisitors: 800,
      firstVisit: new Date(),
      lastVisit: new Date(),
      deviceVisits: {},
      osVisits: {},
    },
  ],
});
</script>
