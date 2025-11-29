<script setup lang="ts">
import {
  Copy,
  MoreVertical,
  Share2,
  Edit,
  Archive,
  BarChart2,
  Globe,
  Download,
  Trash2,
} from "lucide-vue-next";
import type { Url } from "~/client/src/generated/models/Url";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { ref, onMounted, onUnmounted } from "vue";
import ActionDropdown from "~/components/common/ActionDropdown.vue";

// Initialize TimeAgo
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

defineProps<{
  links: Url[];
}>();

const activeDropdownId = ref<string | null>(null);
const elevatedDropdownId = ref<string | null>(null);

// Copy link to clipboard
const copyLinkToClipboard = async (code: string) => {
  try {
    await navigator.clipboard.writeText(`https://envlink.one/${code}`);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

const formatTimeAgo = (date: Date | string) => {
  return timeAgo.format(new Date(date));
};

const toggleDropdown = (id: string) => {
  if (activeDropdownId.value === id) {
    closeDropdown();
  } else {
    elevatedDropdownId.value = id;
    activeDropdownId.value = id;
  }
};

const closeDropdown = () => {
  activeDropdownId.value = null;
};

const onDropdownAfterLeave = () => {
  if (!activeDropdownId.value) {
    elevatedDropdownId.value = null;
  }
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".dropdown-container")) {
    closeDropdown();
  }
};

interface DropdownItem {
  label: string;
  icon?: any;
  action: () => void;
  disabled?: boolean;
  danger?: boolean;
}

const getDropdownItems = (link: Url): DropdownItem[] => [
  {
    label: "Share",
    icon: Share2,
    action: () => console.log("Share", link.id),
  },
  {
    label: "Edit",
    icon: Edit,
    action: () => console.log("Edit", link.id),
  },
  {
    label: "Archived",
    icon: Archive,
    action: () => console.log("Archived", link.id),
  },
  {
    label: "Statistics",
    icon: BarChart2,
    action: () => console.log("Statistics", link.id),
  },
  {
    label: "Set Public",
    icon: Globe,
    action: () => console.log("Set Public", link.id),
  },
  {
    label: "Export Statistics",
    icon: Download,
    action: () => console.log("Export Statistics", link.id),
  },
  {
    label: "Delete",
    icon: Trash2,
    action: () => console.log("Delete", link.id),
    danger: true,
  },
];

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="box-inner-card p-5">
    <h2 class="text-xl font-semibold mb-4">Recent Links</h2>
    <div class="space-y-4">
      <div
        v-for="link in links"
        :key="link.id"
        class="card-box relative dropdown-container"
        :class="{ 'z-20': elevatedDropdownId === link.id }"
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 mb-1">
            <p class="font-semibold truncate">env.link/{{ link.code }}</p>
            <button
              class="p-1 hover:opacity-70 transition-opacity text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              type="button"
              @click="copyLinkToClipboard(link.code)"
            >
              <Copy class="w-3.5 h-3.5" />
            </button>
          </div>
          <p class="text-sm opacity-70 truncate mb-2">
            {{ link.originalUrl }}
          </p>
          <div class="flex items-center gap-2 text-xs">
            <span class="font-semibold">{{ link.clickCount || 0 }} clicks</span>
            <span class="font-semibold"
              >{{ link.uniqueClicks || 0 }} unique</span
            >
            <span class="text-gray-500 dark:text-gray-400">{{
              formatTimeAgo(link.createdAt)
            }}</span>
          </div>
        </div>
        <div class="flex items-center gap-4 ml-4">
          <ActionDropdown
            :is-open="activeDropdownId === link.id"
            @toggle="toggleDropdown(link.id)"
            @close="closeDropdown"
            @after-leave="onDropdownAfterLeave"
          >
            <template #trigger>
              <button
                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                type="button"
              >
                <MoreVertical class="w-4 h-4" />
              </button>
            </template>

            <button
              v-for="(item, index) in getDropdownItems(link)"
              :key="index"
              class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left"
              :class="{
                'text-red-600 dark:text-red-400': item.danger,
                'opacity-50 cursor-not-allowed': item.disabled,
              }"
              :disabled="item.disabled"
              @click.stop="
                () => {
                  item.action();
                  closeDropdown();
                }
              "
            >
              <component :is="item.icon" v-if="item.icon" class="w-4 h-4" />
              <span>{{ item.label }}</span>
            </button>
          </ActionDropdown>
        </div>
      </div>
    </div>
  </div>
</template>
```
