<template>
  <Content :is-ready="true">
    <div
      class="rounded-xl rounded-tr-2xl border-l border-t border-white p-7 bg-[var(--bg-color)] shadow-[inset_-3px_-3px_0px_var(--text-color),inset_3px_3px_0px_grey,inset_-3px_3px_0px_grey,inset_-3px_-3px_0px_white] transition-all"
    >
      <h3 class="text-lg font-medium leading-6">Manage Subscriptions</h3>
      <p class="mt-4 text-gray-500">This is where you would manage your subscription details.</p>
    </div>
  </Content>
</template>

<script setup lang="ts">
import { definePageMeta } from "#imports";
import Content from "~/components/Content.vue";

definePageMeta({
  layout: "account",
});
</script>