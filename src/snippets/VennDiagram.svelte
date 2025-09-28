<script>
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";

  // Animationsfortschritt 0–1
  let progress = tweened(0, { duration: 300, easing: cubicOut });

  onMount(() => {
    const section = document.getElementById("venn-section");

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Fortschritt berechnen (sichtbarer Bereich der Section → 0 bis 1)
      const visible = Math.min(
        Math.max((windowHeight - rect.top) / (rect.height + windowHeight), 0),
        1
      );
      progress.set(visible);
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // initial berechnen

    return () => window.removeEventListener("scroll", onScroll);
  });
</script>

<section id="venn-section" class="relative h-[200vh] bg-white">
  <div class="sticky top-0 h-screen flex items-center justify-center">
    <div class="relative w-[400px] h-[400px]">
      <!-- Kreise -->
      <div
        class="circle bg-red-400/70"
        style="transform: translate({100 * (1 - $progress)}px, {100 * (1 - $progress)}px);"
      >
        Human Computer Interaction
      </div>

      <div
        class="circle bg-green-400/70"
        style="transform: translate({-100 * (1 - $progress)}px, {100 * (1 - $progress)}px);"
      >
        Künstlerische Forschung
      </div>

      <div
        class="circle bg-blue-400/70"
        style="transform: translate(-50%, {-100 * (1 - $progress)}px);"
      >
        Gesellschafts- & Medienwissenschaften
      </div>

      <!-- Mitte -->
      <div
        class="absolute inset-0 flex items-center justify-center font-bold text-xl md:text-3xl text-black text-center px-4"
        style="opacity: {$progress}; transform: scale({0.5 + 0.5 * $progress});"
      >
        Künstliche Intelligenz
      </div>
    </div>
  </div>
</section>

<style>
.circle {
  @apply absolute w-[200px] h-[200px] rounded-full flex items-center justify-center text-center p-4 text-white text-sm;
}
</style>