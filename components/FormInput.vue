<template>
  <div :class="['max-w-full  text-start', props.class]">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-[var(--text-color)] opacity-90 mb-1.5"
    >
      {{ label }}
    </label>

    <div class="relative">
      <div
        v-if="icon"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <component
          :is="icon"
          class="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </div>
      <input
        v-bind="$attrs"
        :id="id"
        :type="inputType"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="w-full bg-transparent border border-[var(--text-color)] rounded-lg py-3 focus:outline-none shadow-[2px_2px_0_var(--text-color)] focus:shadow-[2px_2px_0_#2563eb] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-color)] placeholder-gray-400 sm:text-sm transition-all"
        :class="[icon ? 'pl-10' : 'pl-4', isPassword ? 'pr-10' : 'pr-4']"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
      <div
        v-if="isPassword"
        class="absolute inset-y-0 right-0 flex items-center"
      >
        <button
          type="button"
          class="flex items-center justify-center h-full w-10 text-gray-400 hover:text-gray-500 focus:outline-none"
          @click="togglePasswordVisibility"
        >
          <Eye v-if="inputType === 'password'" class="h-5 w-5" />
          <EyeOff v-else class="h-5 w-5" />
        </button>
      </div>
    </div>

    <p v-if="error" class="mt-2 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Eye, EyeOff } from "lucide-vue-next";

defineOptions({
  inheritAttrs: false,
});

interface Props {
  id: string;
  label: string;
  type?: string;
  modelValue?: string | null;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  class?: string;
  icon?: Function | object;
}

const props = withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  required: false,
  error: "",
  modelValue: "",
  disabled: false,
  class: "",
  icon: undefined,
});

defineEmits(["update:modelValue"]);

const inputType = ref(props.type);

const isPassword = computed(() => props.type === "password");

const togglePasswordVisibility = () => {
  inputType.value = inputType.value === "password" ? "text" : "password";
};
</script>
