<script setup lang="ts">
import { definePageMeta, ref, onMounted, onUnmounted } from "#imports";
import Content from "~/components/Content.vue";
import ShortenedUrlModal from "~/components/ShortenedUrlModal.vue";
import TrafficOverview from "~/components/dashboard/TrafficOverview.vue";
import ShortenSection from "~/components/dashboard/ShortenSection.vue";
import RecentLinks from "~/components/dashboard/RecentLinks.vue";
import RecentActivity from "~/components/dashboard/RecentActivity.vue";
import { MousePointerClick, Globe, BarChart2 } from "lucide-vue-next";

import type { UrlAnalyticsOverview } from "~/client/src/generated/models/UrlAnalyticsOverview";
import type { UrlAnalyticLog } from "~/client/src/generated/models/UrlAnalyticLog";
import type { UrlAnalyticTimeline } from "~/client/src/generated/models/UrlAnalyticTimeline";
import type { Url } from "~/client/src/generated/models/Url";
import { getCountryData, type TCountryCode } from "countries-list";

definePageMeta({
  layout: "dashboard",
});

// Dark mode state for datepicker
const isDarkMode = ref(false);
let observer: MutationObserver | null = null;

onMounted(() => {
  // Dark mode detection for datepicker
  const checkDarkMode = () => {
    isDarkMode.value = document.documentElement.classList.contains("dark");
  };

  observer = new MutationObserver(checkDarkMode);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  checkDarkMode(); // Initial check
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// Modal state for showing shortened URL result
const showShortenedUrlModal = ref(false);
const shortenedUrl = ref<Url | null>(null);

// Handle shortened URL event
const handleShortened = (url: Url) => {
  recentLinks.value.unshift(url);
  shortenedUrl.value = url;
  showShortenedUrlModal.value = true;
};

// Dummy data for recent links using Url interface
const recentLinks = ref<Url[]>([
  {
    id: "url_1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    code: "abcde",
    originalUrl: "https://example.com/a-very-long-url-to-shorten-1",
    isAnonymous: false,
    isProtected: false,
    accessCode: "",
    expiresAt: null,
    clickCount: 120,
    uniqueClicks: 100,
    metadata: {
      title: "Example Domain",
      description:
        "This domain is for use in illustrative examples in documents.",
      favicon: "https://example.com/favicon.ico",
      siteName: "Example.com",
    },
    channels: [
      {
        id: "ch_1",
        name: "Social Media",
        description: "Links shared on social platforms",
      },
    ],
  },
  {
    id: "url_2",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    code: "fghij",
    originalUrl: "https://another-example.com/another-very-long-url-2",
    isAnonymous: false,
    isProtected: true,
    accessCode: "secret123",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
    clickCount: 88,
    uniqueClicks: 50,
    metadata: {
      title: "Another Example Site",
      description:
        "A comprehensive guide to web development and design patterns.",
      favicon: "https://another-example.com/favicon.ico",
      siteName: "AnotherExample.com",
      image: "https://another-example.com/og-image.jpg",
    },
    channels: [
      {
        id: "ch_2",
        name: "Marketing Campaign",
        description: "Marketing and promotional links",
      },
      {
        id: "ch_3",
        name: "Email Newsletter",
        description: "Links sent via email campaigns",
      },
    ],
  },
]);

// Dummy data for Analytics Timeline
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

// Dummy data for Analytics Overview
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

// Dummy data for Recent Analytics Logs
const recentLogs = ref<UrlAnalyticLog[]>([
  {
    id: "1",
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    updatedAt: new Date(),
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
    referrer: "google.com",
    region: "CA",
    city: "San Francisco",
    countryCode: "US",
    deviceType: "Desktop",
    os: "macOS",
    language: "en-US",
    isUnique: true,
    browser: "Chrome",
    visitorCount: 1,
    urlId: "url_1",
    channels: [],
  },
  {
    id: "2",
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    updatedAt: new Date(),
    ipAddress: "10.0.0.5",
    userAgent: "Mozilla/5.0...",
    referrer: "twitter.com",
    region: "NY",
    city: "New York",
    countryCode: "US",
    deviceType: "Mobile",
    os: "iOS",
    language: "en-US",
    isUnique: false,
    browser: "Safari",
    visitorCount: 5,
    urlId: "url_2",
    channels: [],
  },
  {
    id: "3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(),
    ipAddress: "172.16.0.1",
    userAgent: "Mozilla/5.0...",
    referrer: "direct",
    region: "BE",
    city: "Berlin",
    countryCode: "DE",
    deviceType: "Desktop",
    os: "Windows",
    language: "de-DE",
    isUnique: true,
    browser: "Firefox",
    visitorCount: 1,
    urlId: "url_3",
    channels: [],
  },
]);
</script>

<template>
  <Content>
    <!-- Shortened URL Modal -->
    <ShortenedUrlModal
      :is-open="showShortenedUrlModal"
      :url="shortenedUrl"
      @close="showShortenedUrlModal = false"
    />

    <div class="grid grid-cols-1 xl:grid-cols-4 min-w-full gap-8 pb-56">
      <!-- Traffic Overview -->
      <div class="col-span-4">
        <TrafficOverview
          :timeline-data="timelineData"
          :analytics-overview="analyticsOverview"
          :is-dark-mode="isDarkMode"
          :switchable="false"
          default-mode="area"
        />
      </div>

      <!-- Left Column -->
      <div class="col-span-4 xl:col-span-2 space-y-8">
        <!-- Shorten Form -->
        <ShortenSection
          :is-dark-mode="isDarkMode"
          @shortened="handleShortened"
        />

        <!-- Recent Links -->
        <RecentLinks :links="recentLinks" />
      </div>

      <!-- Right Column -->
      <div class="col-span-4 xl:col-span-2 space-y-8">
        <div class="box-inner-card p-5 sm:hidden">
          <h2 class="text-xl font-semibold mb-4">Analytics Overview</h2>
          <div class="space-y-5">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-transform hover:scale-110"
              >
                <MousePointerClick class="w-6 h-6" />
              </div>
              <div>
                <p class="text-sm opacity-80">Total Visits</p>
                <p class="text-2xl font-bold">
                  {{ analyticsOverview.totalVisits?.toLocaleString() || 0 }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-transform hover:scale-110"
              >
                <Globe class="w-6 h-6" />
              </div>
              <div>
                <p class="text-sm opacity-80">Top Location</p>
                <p class="text-2xl font-bold">
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
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-transform hover:scale-110"
              >
                <BarChart2 class="w-6 h-6" />
              </div>
              <div>
                <p class="text-sm opacity-80">Top Link</p>
                <p class="text-lg font-bold truncate">
                  {{
                    analyticsOverview.topUrls?.[0]?.url?.originalUrl ||
                    "No Data"
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Analytics Logs -->
        <RecentActivity :logs="recentLogs" />
      </div>
    </div>
  </Content>
</template>
