<template>
  <div class="logo-wrapper text-(--text-color)" :style="wrapperStyle">
    <svg
      viewBox="0 0 300 244"
      preserveAspectRatio="xMidYMid meet"
      class="logo-svg"
    >
      <g transform="translate(0,244) scale(0.05,-0.05)">
        <!-- Fill paths -->
        <path
          class="fill-path fill-current"
          d="M3940 3740 c-35 -35 -40 -67 -40 -240 l0 -200 -335 1 c-184 1 -672 9
          -1085 18 -835 18 -919 11 -1154 -104 -532 -257 -625 -1019 -175 -1433 144
          -133 169 -119 107 64 -81 239 34 512 251 594 143 54 1972 6 2129 -56 273 -108
          397 -276 470 -642 12 -60 32 -112 44 -116 31 -10 953 882 977 945 28 74 17 87
          -556 677 -531 545 -558 567 -633 492z"
        />

        <path
          class="fill-path fill-current"
          d="M1930 2312 c-297 -93 -504 -384 -485 -682 52 -835 1365 -868 1365
          -34 0 208 -9 223 -134 224 -156 0 -216 -71 -216 -259 0 -215 -259 -316 -500
          -195 -238 120 -230 489 12 604 107 51 1355 28 1467 -26 181 -89 253 -319 157
          -503 -81 -156 -115 -170 -458 -178 l-299 -7 -60 -88 c-33 -48 -97 -117 -142
          -153 l-82 -65 158 -12 c334 -26 653 -20 765 13 615 184 673 1036 88 1303 -173
          79 -1428 124 -1636 58z"
        />

        <!-- Animated stroke paths -->
        <path
          class="animated-path stroke-current"
          d="M3940 3740 c-35 -35 -40 -67 -40 -240 l0 -200 -335 1 c-184 1 -672 9
          -1085 18 -835 18 -919 11 -1154 -104 -532 -257 -625 -1019 -175 -1433 144
          -133 169 -119 107 64 -81 239 34 512 251 594 143 54 1972 6 2129 -56 273 -108
          397 -276 470 -642 12 -60 32 -112 44 -116 31 -10 953 882 977 945 28 74 17 87
          -556 677 -531 545 -558 567 -633 492z"
        />

        <path
          class="animated-path stroke-current"
          d="M1930 2312 c-297 -93 -504 -384 -485 -682 52 -835 1365 -868 1365
          -34 0 208 -9 223 -134 224 -156 0 -216 -71 -216 -259 0 -215 -259 -316 -500
          -195 -238 120 -230 489 12 604 107 51 1355 28 1467 -26 181 -89 253 -319 157
          -503 -81 -156 -115 -170 -458 -178 l-299 -7 -60 -88 c-33 -48 -97 -117 -142
          -153 l-82 -65 158 -12 c334 -26 653 -20 765 13 615 184 673 1036 88 1303 -173
          79 -1428 124 -1636 58z"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  size: { type: Number, default: 120 },
});

const wrapperStyle = computed(() => ({
  width: `${props.size}px`,
  height: "auto",
}));
</script>

<style scoped>
.logo-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.logo-svg {
  width: 100%;
  height: auto;
  background: transparent;
}

.animated-path {
  fill: none;
  stroke-width: 100;
  stroke-linecap: round;
  stroke-linejoin: round;
  shape-rendering: geometricPrecision;
  stroke-dasharray: 4800;
  animation: smoothLoop 2.5s ease-in-out infinite;
}

@keyframes smoothLoop {
  0% {
    stroke-dashoffset: 4000;
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  45% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  75% {
    opacity: 0;
  }
  100% {
    stroke-dashoffset: 4000;
    opacity: 0;
  }
}

.fill-path {
  animation: fadeFill 2.5s ease-in-out infinite;
}

@keyframes fadeFill {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
