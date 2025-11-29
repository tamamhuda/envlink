import { defineNuxtPlugin } from "#app";
// @ts-expect-error jsvectormap does not have types
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/maps/world.js";
import "jsvectormap/dist/jsvectormap.css";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      jsVectorMap,
    },
  };
});
