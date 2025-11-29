<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
  watch,
} from "#imports";
import {
  Link,
  ChevronDown,
  Settings2,
  Lock,
  Calendar,
  Tag,
  Share2,
  X,
} from "lucide-vue-next";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import type { Url } from "~/client/src/generated/models/Url";
import ActionDropdown from "~/components/common/ActionDropdown.vue";

const emit = defineEmits<{
  (e: "shortened", url: Url): void;
}>();

defineProps<{
  isDarkMode: boolean;
}>();

// Form state
const form = reactive({
  original_url: "",
  code: "",
  is_protected: false,
  access_code: "",
  expires_at: null as Date | null,
  channel_ids: [] as any[],
});

// Advanced options state
const showAdvancedOptions = ref(false);
const isDatePickerOpen = ref(false);

// Channels data
const channels = ref([
  { id: "1", name: "Social Media" },
  { id: "2", name: "Marketing Campaign" },
]);

// Custom Multi-Select State
const multiselectOpen = ref(false);
const multiselectInput = ref("");
const multiselectRef = ref<HTMLElement | null>(null);

// Date picker ref for click outside
const datePickerRef = ref<HTMLElement | null>(null);

// Filtered options based on search
const filteredChannels = computed(() => {
  if (!multiselectInput.value) return channels.value;
  return channels.value.filter((channel) =>
    channel.name.toLowerCase().includes(multiselectInput.value.toLowerCase())
  );
});

// Check if we should show "Create" option
const showCreateOption = computed(() => {
  if (!multiselectInput.value.trim()) return false;
  return !channels.value.some(
    (channel) =>
      channel.name.toLowerCase() === multiselectInput.value.toLowerCase()
  );
});

// Toggle option selection
const toggleOption = (channel: any) => {
  const index = form.channel_ids.findIndex((c) => c.id === channel.id);
  if (index > -1) {
    form.channel_ids.splice(index, 1);
  } else {
    form.channel_ids.push(channel);
  }
};

// Create new channel
const createChannel = () => {
  if (!multiselectInput.value.trim()) return;

  const newChannel = {
    id: String(Date.now()),
    name: multiselectInput.value.trim(),
  };

  channels.value.push(newChannel);
  form.channel_ids.push(newChannel);
  multiselectInput.value = "";
};

// Remove selected channel
const removeChannel = (channelId: string) => {
  form.channel_ids = form.channel_ids.filter((c) => c.id !== channelId);
};

// Handle click outside for both multiselect and date picker
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node;

  // Check if click is inside multiselect
  const clickedMultiselect = multiselectRef.value?.contains(target);
  // Check if click is inside date picker
  const clickedDatePicker = datePickerRef.value?.contains(target);

  // Close multiselect if clicked outside OR if clicked on date picker
  if (multiselectRef.value && !clickedMultiselect) {
    multiselectOpen.value = false;
  }

  // Close date picker if clicked outside OR if clicked on multiselect
  if (datePickerRef.value && !clickedDatePicker) {
    isDatePickerOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Submit form
const shortenUrl = () => {
  const payload = {
    ...form,
    expires_at: form.expires_at
      ? new Date(form.expires_at).toISOString()
      : null,
  };
  console.log("Form submitted:", payload);

  // Create a new Url object for demo
  const newUrl: Url = {
    id: `url_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    code: form.code || `${Math.random().toString(36).substring(2, 7)}`,
    originalUrl: form.original_url,
    isAnonymous: false,
    isProtected: form.is_protected,
    accessCode: form.access_code || "",
    expiresAt: form.expires_at ? new Date(form.expires_at) : null,
    clickCount: 0,
    metadata: {
      title: "New Link",
      description: "Freshly shortened link",
    },
    channels: form.channel_ids.map((ch) => ({
      id: ch.id,
      name: ch.name,
      description: ch.description || "",
    })),
  };

  emit("shortened", newUrl);

  // Reset form
  form.original_url = "";
  form.code = "";
  form.is_protected = false;
  form.access_code = "";
  form.expires_at = null;
  form.channel_ids = [];
  showAdvancedOptions.value = false;
};

// Toggle advanced options
const toggleAdvancedOptions = () => {
  showAdvancedOptions.value = !showAdvancedOptions.value;
};

// Watch for date selection to auto-close the picker
watch(
  () => form.expires_at,
  (newValue) => {
    if (newValue) {
      isDatePickerOpen.value = false;
    }
  }
);

// Watch date picker state to close multiselect when it opens
watch(
  () => isDatePickerOpen.value,
  (isOpen) => {
    if (isOpen) {
      multiselectOpen.value = false;
    }
  }
);

// Watch multiselect state to close date picker when it opens
watch(
  () => multiselectOpen.value,
  (isOpen) => {
    if (isOpen) {
      isDatePickerOpen.value = false;
    }
  }
);
</script>

<template>
  <div class="box-inner-card p-5">
    <h1 class="text-2xl font-semibold mb-6">Shorten a new link</h1>

    <form class="space-y-4" @submit.prevent="shortenUrl">
      <!-- URL Input -->
      <div class="relative group">
        <Link
          class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50 transition-opacity group-focus-within:opacity-100"
        />
        <input
          v-model="form.original_url"
          type="url"
          required
          placeholder="Paste your long URL here"
          class="text-input shadow-[4px_4px_0_var(--shadow-color)] focus:shadow-[2px_2px_0_blue]"
        />
      </div>

      <!-- Advanced Options Toggle -->
      <button
        class="w-full inline-flex items-center justify-center gap-2 text-sm font-medium hover:opacity-80 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        type="button"
        @click="toggleAdvancedOptions"
      >
        <Settings2 class="w-4 h-4" />
        <span>Advanced Options</span>
        <ChevronDown
          class="w-4 h-4 transition-transform duration-300"
          :class="showAdvancedOptions && 'rotate-180'"
        />
      </button>

      <!-- Advanced Options Panel -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-[1200px]"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 max-h-[1200px]"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-show="showAdvancedOptions" class="overflow-visible">
          <div
            class="space-y-4 pt-4 border-t border-dashed border-(--border-color)"
          >
            <!-- Custom Alias -->
            <div class="relative group">
              <Tag
                class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50 transition-opacity group-focus-within:opacity-100"
              />
              <input
                v-model="form.code"
                type="text"
                placeholder="Custom alias (optional)"
                class="text-input"
              />
            </div>

            <!-- Password Protection -->
            <div
              class="space-y-3 w-full justify-center items-center border border-(--border-color) font-medium bg-transparent text-(--text-color) px-4 py-3.5 rounded-lg"
              :class="
                form.is_protected
                  ? 'shadow-[2px_2px_0_#3B82F6]  '
                  : 'shadow-[2px_2px_0_var(--shadow-color)]'
              "
            >
              <div class="flex items-center">
                <input
                  id="is_protected"
                  v-model="form.is_protected"
                  type="checkbox"
                  class="h-4 w-4 rounded accent-blue-600 cursor-pointer transition-all"
                />
                <label
                  for="is_protected"
                  class="ml-3 text-sm font-medium cursor-pointer select-none"
                >
                  Password Protection
                </label>
              </div>

              <!-- Password Input -->
              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div v-if="form.is_protected" class="relative group">
                  <Lock
                    class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-50 transition-opacity group-focus-within:opacity-100"
                  />
                  <input
                    v-model="form.access_code"
                    type="text"
                    placeholder="Enter access code"
                    class="text-input"
                  />
                </div>
              </Transition>
            </div>

            <!-- Expiration Date with ActionDropdown -->
            <div ref="datePickerRef">
              <ActionDropdown
                :is-open="isDatePickerOpen"
                dropdown-class="w-auto"
                full-width
                @toggle="isDatePickerOpen = !isDatePickerOpen"
                @close="isDatePickerOpen = false"
              >
                <template #trigger>
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 text-left px-4 py-3 bg-transparent border border-(--border-color) rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-[2px_2px_0_var(--shadow-color)]"
                  >
                    <Calendar class="h-5 w-5 opacity-50" />
                    <span class="text-sm">
                      {{
                        form.expires_at
                          ? new Date(form.expires_at).toLocaleString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Select expiration date (optional)"
                      }}
                    </span>
                  </button>
                </template>

                <div class="p-2">
                  <VueDatePicker
                    v-model="form.expires_at"
                    inline
                    :enable-time-picker="true"
                    :is-24="true"
                    :dark="isDarkMode"
                    auto-apply
                  />
                </div>
              </ActionDropdown>
            </div>

            <!-- Custom Multi-Select -->
            <div class="space-y-2">
              <label class="text-sm font-medium block"
                >Channels (optional)</label
              >
              <div ref="multiselectRef">
                <ActionDropdown
                  :is-open="multiselectOpen"
                  dropdown-class="w-full"
                  full-width
                  @toggle="multiselectOpen = !multiselectOpen"
                  @close="multiselectOpen = false"
                >
                  <template #trigger>
                    <div class="relative">
                      <Share2
                        class="absolute left-3 top-3.5 h-5 w-5 opacity-50 pointer-events-none z-10"
                      />
                      <div class="text-input">
                        <div
                          class="flex w-full flex-wrap gap-2 items-center"
                        >
                          <!-- Selected Tags -->
                          <span
                            v-for="channel in form.channel_ids"
                            :key="channel.id"
                            class="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-2.5 py-1 rounded-full"
                          >
                            {{ channel.name }}
                            <button
                              type="button"
                              class="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
                              @click.stop="removeChannel(channel.id)"
                            >
                              <X class="w-3.5 h-3.5" />
                            </button>
                          </span>

                          <!-- Input Field -->
                          <input
                            v-model="multiselectInput"
                            type="text"
                            placeholder="Select or create channels"
                            class="flex-1 w-full min-w-[120px] bg-transparent border-none outline-none text-sm"
                          />

                          <!-- Dropdown Arrow -->
                          <ChevronDown
                            class="w-5 h-5 opacity-50 transition-transform duration-200"
                            :class="{ 'rotate-180': multiselectOpen }"
                          />
                        </div>
                      </div>
                    </div>
                  </template>

                  <div
                    class="font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors overflow-hidden"
                  >
                    <!-- Options List -->
                    <div
                      v-if="filteredChannels.length > 0"
                      class="py-1 max-h-60 overflow-y-auto"
                    >
                      <button
                        v-for="channel in filteredChannels"
                        :key="channel.id"
                        type="button"
                        class="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        :class="{
                          'bg-blue-100 dark:bg-blue-900/30 font-medium':
                            form.channel_ids.some((c) => c.id === channel.id),
                        }"
                        @click.stop="toggleOption(channel)"
                      >
                        <span>{{ channel.name }}</span>
                        <span
                          v-if="
                            form.channel_ids.some((c) => c.id === channel.id)
                          "
                          class="text-blue-600 dark:text-blue-400 text-xs"
                        >
                          ✓
                        </span>
                      </button>
                    </div>

                    <!-- No Results -->
                    <div
                      v-else-if="!showCreateOption"
                      class="px-4 py-3 text-sm text-center opacity-60"
                    >
                      No channels found
                    </div>

                    <!-- Create New Option -->
                    <button
                      v-if="showCreateOption"
                      type="button"
                      class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 border-t-2 border-(--border-color) transition-colors font-medium text-blue-600 dark:text-blue-400"
                      @click.stop="createChannel"
                    >
                      <span class="text-lg">+</span>
                      <span>Create "{{ multiselectInput }}"</span>
                    </button>
                  </div>
                </ActionDropdown>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Submit Button -->
      <button
        type="submit"
        class="button-box w-full flex items-center justify-center py-3 hover:translate-x-0.5 hover:translate-y-0.5"
      >
        Shorten URL
      </button>
    </form>
  </div>
</template>

<style scoped>
@reference "../../assets/css/tailwind.css";

/* Smooth transitions */
input,
select,
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

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

/* Time selector styling */
:deep(.dp__time_input) {
  color: var(--text-color);
}

:deep(.dp__time_col) {
  color: var(--text-color);
}

/* Action row (bottom buttons) */
:deep(.dp__action_row) {
  display: none; /* Hide since we're using auto-apply */
}

/* Selected date styling - match the custom variables */
:deep(.dp__active_date),
:deep(.dp__range_start),
:deep(.dp__range_end) {
  background: var(--primary-color) !important;
  color: #fff !important;
}

/* Dark mode selected dates */
:deep(.dp--dark .dp__active_date),
:deep(.dp--dark .dp__range_start),
:deep(.dp--dark .dp__range_end) {
  background: var(--date-range-color) !important;
  border: 1px solid var(--border-color) !important;
  color: #fff !important;
}

/* Hover effect on selected dates */
:deep(.dp__active_date:hover),
:deep(.dp__range_start:hover),
:deep(.dp__range_end:hover) {
  background: rgba(86, 48, 252, 0.3) !important;
  color: var(--text-color) !important;
}

:deep(.dp--dark .dp__active_date:hover),
:deep(.dp--dark .dp__range_start:hover),
:deep(.dp--dark .dp__range_end:hover) {
  background: rgba(86, 48, 252, 0.3) !important;
  color: var(--text-color) !important;
}

/* Range between dates */
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

/* Today's date */
:deep(
  .dp__today:not(.dp__active_date):not(.dp__range_start):not(.dp__range_end)
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

/* Custom scrollbar for dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
}

.dark .overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.7);
}
</style>
