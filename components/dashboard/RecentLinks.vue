<script setup lang="ts">
import { Copy } from "lucide-vue-next";
import type { Url } from "~/client/src/generated/models/Url";

defineProps<{
  links: Url[];
}>();

// Copy link to clipboard
const copyLinkToClipboard = async (code: string) => {
  try {
    await navigator.clipboard.writeText(`https://env.link/${code}`);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};
</script>

<template>
  <div class="box-inner-card p-5">
    <h2 class="text-xl font-semibold mb-4">Recent Links</h2>
    <div class="space-y-4">
      <div v-for="link in links" :key="link.id" class="card-box">
        <div class="min-w-0">
          <p class="font-semibold truncate">env.link/{{ link.code }}</p>
          <p class="text-sm opacity-70 truncate">
            {{ link.originalUrl }}
          </p>
        </div>
        <div class="flex items-center gap-4 ml-4">
          <span class="text-sm font-semibold"
            >{{ link.clickCount || 0 }} clicks</span
          >
          <button
            class="p-2 hover:opacity-70 transition-opacity"
            type="button"
            @click="copyLinkToClipboard(link.code)"
          >
            <Copy class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
