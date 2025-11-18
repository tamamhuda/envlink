<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { VueDraggableNext } from "vue-draggable-next";

import {
  CreditCard,
  GripVertical,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
} from "lucide-vue-next";
import type { PaymentMethod } from "~/client";

const props = defineProps<{
  modelValue: PaymentMethod[];
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: PaymentMethod[]): void;
  (e: "set-default", value: { pm: PaymentMethod; index: number }): void;
  (e: "move-up" | "move-down", value: number): void;
  (e: "remove" | "edit", value: PaymentMethod): void;
  (e: "drag-end"): void;
}>();

const openDropdownId = ref<string | null>(null);
const drag = ref(false);

const toggleDropdown = (pmId: string) => {
  openDropdownId.value = openDropdownId.value === pmId ? null : pmId;
};

const closeDropdown = () => {
  openDropdownId.value = null;
};

onMounted(() => {
  window.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  window.removeEventListener("click", closeDropdown);
});

const onDragEnd = () => {
  drag.value = false;
  emit("drag-end");
};

const localMethods = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <div class="flow-root">
    <client-only>
      <template #fallback>
        <p class="text-sm opacity-70 text-center py-6">
          Loading payment methods...
        </p>
      </template>

      <div v-if="loading" class="text-sm opacity-70 text-center py-6">
        <p>Loading payment methods...</p>
      </div>

      <div
        v-else-if="localMethods.length === 0"
        class="text-sm opacity-70 text-center py-6"
      >
        <p>You don't have any payment methods yet. Add one to get started.</p>
      </div>

      <div v-else class="payment-methods-container">
        <VueDraggableNext
          v-model="localMethods"
          :animation="300"
          ghost-class="ghost"
          drag-class="drag"
          handle=".drag-handle"
          @start="drag = true"
          @end="onDragEnd"
        >
          <div v-for="(pm, index) in localMethods" :key="pm.id" role="listitem">
            <div
              class="payment-method-card relative flex items-center justify-between px-5 py-4 border border-[var(--text-color)] rounded-md bg-transparent text-[var(--text-color)] shadow-[4px_4px_0_var(--text-color)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_var(--text-color)]"
              :class="{ 'dropdown-open': openDropdownId === pm.id }"
            >
              <div class="flex items-center flex-1 min-w-0">
                <div
                  class="drag-handle mr-3 cursor-grab active:cursor-grabbing"
                >
                  <GripVertical class="h-5 w-5 opacity-70" />
                </div>
                <CreditCard class="h-6 w-6 opacity-80" />
                <div class="ml-4 flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-medium">
                      {{ pm.customName || pm.card?.network }}
                    </p>
                    <span class="text-sm opacity-70">
                      •••• {{ pm.card?.maskedCardNumber?.slice(-4) }}
                    </span>
                  </div>
                  <p class="text-xs opacity-60 mt-0.5">
                    Expires {{ pm.card?.expiryMonth }}/{{ pm.card?.expiryYear }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3 ml-4">
                <span
                  v-if="index === 0 && !drag"
                  class="default inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-[var(--text-color)]"
                >
                  Default
                </span>
                <div class="relative">
                  <button
                    class="p-1 rounded-full hover:bg-gray-300/50 dark:hover:bg-gray-700/50"
                    @click.stop="toggleDropdown(pm.id)"
                  >
                    <MoreVertical class="h-5 w-5" />
                  </button>
                  <div
                    v-if="openDropdownId === pm.id"
                    class="absolute right-0 mt-2 w-48 bg-[var(--bg-color)] border border-[var(--text-color)] rounded-lg shadow-[2px_2px_0_var(--text-color)] z-50"
                    @click.stop
                  >
                    <ul>
                      <li>
                        <button
                          class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          :disabled="index === 0"
                          @click="
                            $emit('set-default', { pm, index });
                            closeDropdown();
                          "
                        >
                          <Star class="w-4 h-4" />
                          Set as Default
                        </button>
                      </li>
                      <li>
                        <button
                          class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          :disabled="index === 0"
                          @click="
                            $emit('move-up', index);
                            closeDropdown();
                          "
                        >
                          <ArrowUp class="w-4 h-4" />
                          Move Up
                        </button>
                      </li>
                      <li>
                        <button
                          class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          :disabled="index === localMethods.length - 1"
                          @click="
                            $emit('move-down', index);
                            closeDropdown();
                          "
                        >
                          <ArrowDown class="w-4 h-4" />
                          Move Down
                        </button>
                      </li>
                      <li
                        class="border-t border-gray-200 dark:border-gray-700 my-1"
                      ></li>
                      <li>
                        <button
                          class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-800/50"
                          @click="
                            $emit('edit', pm);
                            closeDropdown();
                          "
                        >
                          <Pencil class="w-4 h-4" />
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-800/50"
                          @click="
                            $emit('remove', pm);
                            closeDropdown();
                          "
                        >
                          <Trash2 class="w-4 h-4" />
                          Remove
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="index === 0 && localMethods.length > 1 && !drag"
              class="divider-container relative py-3 my-4 pointer-events-none"
            >
              <div
                class="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div
                  class="w-full border-t border-dashed border-gray-400 dark:border-gray-600"
                />
              </div>
              <div class="relative flex justify-center">
                <span
                  class="bg-[var(--bg-color)] px-3 text-xs text-gray-500 dark:text-gray-400"
                >
                  For renewals, we'll charge the next in line if the default
                  fails
                </span>
              </div>
            </div>
            <div
              v-if="index < localMethods.length - 1 && index !== 0"
              class="mb-4"
            ></div>
          </div>
        </VueDraggableNext>
      </div>
    </client-only>
  </div>
</template>

<style scoped>
.payment-methods-container {
  position: relative;
}
.payment-method-card {
  position: relative;
  z-index: 1;
}
.payment-method-card.dropdown-open {
  z-index: 1000;
}
.divider-container {
  position: relative;
  z-index: 0;
  pointer-events: none;
}
.ghost {
  opacity: 0.5;
  background-color: var(--bg-color);
  border: 2px dashed var(--text-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.ghost .divider-container {
  display: none;
}
.drag {
  transform: translate(2px, 2px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drag .divider-container,
.drag .default {
  display: none;
}
</style>
