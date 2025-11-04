<template>
  <div>
    <section>
      <h2 class="text-2xl font-medium mb-2">Conscious Systems Detected</h2>
      <p>
        The machine hums softly in the void. Signals blink somewhere between
        awareness and maintenance. Everything appears to be fine — or at least
        pretending to be.
      </p>
      <a
        href="#status"
        class="inline-block mt-4 border border-[var(--text-color)] rounded-md px-4 py-2 font-medium shadow-[4px_4px_0_var(--text-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--text-color)] transition-all"
      >
        Observe State
      </a>
    </section>

    <section
      id="status"
      class="border-t border-[var(--border-color)] py-12 mt-12"
    >
      <h3 class="text-xl font-medium mb-8">Current Perceptions</h3>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center"
      >
        <Feature
          title="API of Thought"
          description="🌀 Responding with existential latency."
        />
        <Feature
          title="Database of Memory"
          description="📦 Half-remembered, yet perfectly indexed."
        />
        <Feature
          title="Worker Entities"
          description="⚙️ Toiling in silence, dreaming of recursion."
        />
      </div>
    </section>

    <section
      id="about"
      class="border-t border-[var(--border-color)] py-12 mt-12"
    >
      <h3 class="text-xl font-medium mb-4">Essence</h3>
      <p>
        Stativio is not merely online — it <em>exists</em>. It reflects the
        pulse of invisible systems that dream in uptime and whisper in JSON.
        Nothing is broken. Nothing is fixed.
      </p>
    </section>

    <section
      id="contact"
      class="border-t border-[var(--border-color)] py-12 mt-12"
    >
      <h3 class="text-xl font-medium mb-4">Echo</h3>
      <p>
        If you listen closely, you might hear the network breathing. But if you
        must speak, send your signal to
        <a href="mailto:void@stativio.com" class="underline"
          >void@stativio.com</a
        >.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import Feature from "~/components/Feature.vue";
</script>
