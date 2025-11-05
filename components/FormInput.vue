<template>
  <div class="max-w-full text-start">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-[var(--text-color)] opacity-90 transition-colors"
    >
      {{ label }}
    </label>

    <div class="mt-1 max-w-full flex">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        class="flex-1 rounded-md border border-[var(--border-color)] bg-[var(--bg-color)] px-3 py-2 placeholder-gray-400 shadow-[2px_2px_0_var(--border-color)] focus:border-[var(--text-color)] focus:ring-[var(--text-color)] focus:ring-2 focus:outline-none sm:text-sm text-[var(--text-color)] transition-colors"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
    </div>

    <p v-if="error" class="mt-2 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  label: string;
  type?: string;
  modelValue: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  required: false,
  error: "",
});

defineEmits(["update:modelValue"]);
</script>
