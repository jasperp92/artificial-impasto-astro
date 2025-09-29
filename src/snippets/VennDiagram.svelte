<script>
  let progress = $state(0);
  let baseWidth = 1000; // Basis-Breite des Diagramms
  let scale = $state(1);

  $effect(() => {
    function updateScale() {
      const viewportWidth = window.innerWidth;
      // Skaliere proportional, max = 1 (nicht größer als Basis)
      scale = Math.min(viewportWidth / baseWidth, 1);
    }

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  });
</script>

<section id="venn-section" class="relative h-screen bg-transparent flex items-center justify-center">
  <!-- Wrapper skaliert das gesamte Diagramm -->
  <div
    class="origin-center"
    style="transform: scale({scale}); width: {baseWidth}px; height: 600px;"
  >
    <div class="relative w-full h-full">
      <!-- Oben -->
      <div
        class="absolute rounded-full flex items-center justify-center text-center text-white font-bold text-lg bg-white/30"
        style="
          width: 600px;
          height: 600px;
          top: 0;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        "
      >
        Künstlerische<br />Forschung
      </div>

      <!-- Unten links -->
      <div
        class="absolute rounded-full flex items-center justify-center text-center text-white font-bold text-lg bg-white/30"
        style="
          width: 600px;
          height: 600px;
          bottom: 0;
          left: 25%;
          transform: translateX(-50%) translateY(25%);
        "
      >
        Human-Computer-<br />Interaction (HCI)
      </div>

      <!-- Unten rechts -->
      <div
        class="absolute rounded-full flex items-center justify-center text-center text-white font-bold text-lg bg-white/30"
        style="
          width: 600px;
          height: 600px;
          bottom: 0;
          right: 25%;
          transform: translateX(50%) translateY(25%);
        "
      >
        Medienwissenschaft
      </div>

      <!-- Mitte -->
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
        <div class="font-extrabold text-5xl leading-none">KI</div>
        <div class="font-bold text-base mt-1">künstliche Intelligenz</div>
      </div>
    </div>
  </div>
</section>
