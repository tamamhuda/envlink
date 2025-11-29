<script setup lang="ts">
import { Globe, MousePointerClick } from "lucide-vue-next";
import type { UrlAnalyticLog } from "~/client/src/generated/models/UrlAnalyticLog";

defineProps<{
  logs: UrlAnalyticLog[];
}>();
</script>

<template>
  <div class="box-inner-card p-7">
    <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
    <div class="space-y-4">
      <div
        v-for="log in logs"
        :key="log.id"
        class="flex items-center justify-between p-3 border border-(--border-color) rounded-lg bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400"
          >
            <Globe v-if="log.country" class="w-4 h-4" />
            <MousePointerClick v-else class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <p class="font-medium text-sm truncate">
              {{ log.ipAddress }}
            </p>
            <p class="text-xs opacity-70 truncate">
              {{ log.city }}, {{ log.country }} • {{ log.deviceType }}
            </p>
          </div>
        </div>
        <div class="text-right shrink-0">
          <p class="text-xs font-medium">
            {{ new Date(log.createdAt).toLocaleTimeString() }}
          </p>
          <p class="text-[10px] opacity-60">
            {{ new Date(log.createdAt).toLocaleDateString() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
