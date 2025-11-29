<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from "vue";

const props = defineProps<{
  isOpen: boolean;
  dropdownClass?: string;
  fullWidth?: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle", event: Event): void;
  (e: "close" | "after-leave"): void;
}>();

const dropdownPosition = ref<"bottom" | "top">("bottom");
const triggerRef = ref<HTMLElement | null>(null);

const updatePosition = () => {
  if (!triggerRef.value) return;

  const rect = triggerRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const dropdownHeight = 320; // Approximate height of dropdown

  if (spaceBelow < dropdownHeight) {
    dropdownPosition.value = "top";
  } else {
    dropdownPosition.value = "bottom";
  }
};

const handleTriggerClick = (event: Event) => {
  triggerRef.value = event.currentTarget as HTMLElement;
  emit("toggle", event);
};

const startListeners = () => {
  window.addEventListener("scroll", updatePosition, { passive: true });
  window.addEventListener("resize", updatePosition, { passive: true });
  // Initial position update
  nextTick(() => {
    updatePosition();
  });
};

const stopListeners = () => {
  window.removeEventListener("scroll", updatePosition);
  window.removeEventListener("resize", updatePosition);
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      startListeners();
    } else {
      stopListeners();
    }
  }
);

onUnmounted(() => {
  stopListeners();
});
</script>

<template>
  <div class="relative action-dropdown" :class="{ 'w-full': fullWidth }">
    <div
      :class="[fullWidth ? 'block w-full' : 'inline-block']"
      @click.stop="handleTriggerClick"
    >
      <slot name="trigger" />
    </div>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
      @after-leave="emit('after-leave')"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 box-shadow-card z-50"
        :class="[
          dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
          dropdownClass || 'w-48',
        ]"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>
