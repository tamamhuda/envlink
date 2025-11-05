<template>
  <div
    class="absolute w-full h-full inset-0 text-center min-h-full flex flex-col flex-1 items-center justify-center"
  >
    <div class="flex items-center justify-center space-x-2">
      <div
        class="h-3 w-3 rounded-full bg-current animate-pulse"
        style="opacity: 0.7"
      ></div>
      <div
        class="h-3 w-3 rounded-full bg-current animate-pulse delay-150"
        style="opacity: 0.7"
      ></div>
      <div
        class="h-3 w-3 rounded-full bg-current animate-pulse delay-300"
        style="opacity: 0.7"
      ></div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulseDelay {
  0%,
  80%,
  100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}

.animate-pulse {
  animation: pulseDelay 1.4s infinite ease-in-out;
}

.delay-150 {
  animation-delay: 0.15s;
}

.delay-300 {
  animation-delay: 0.3s;
}
</style>
