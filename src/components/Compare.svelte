<script lang="ts">
  import { onMount } from "svelte";

  export let before: string;   // nur .src aus ImageMetadata
  export let after: string;
  export let altBefore: string = "Vorher";
  export let altAfter: string = "Nachher";
  export let value: number = 50;
  export let maxWidth: number | string = "1100px";

  let root: HTMLDivElement;
  let divider: HTMLDivElement;

  let split = value;

  function set(v: number) {
    split = Math.max(0, Math.min(100, v));
    root.style.setProperty("--split", split + "%");
    divider.setAttribute("aria-valuenow", Math.round(split).toString());
  }

  function updateFromClientX(clientX: number) {
    const rect = root.getBoundingClientRect();
    let v = ((clientX - rect.left) / rect.width) * 100;
    set(v);
  }

  onMount(() => {
    set(value);
  });

  function pointerDown(e: PointerEvent) {
    divider.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }
  function pointerMove(e: PointerEvent) {
    if (divider.hasPointerCapture(e.pointerId)) {
      updateFromClientX(e.clientX);
    }
  }
  function pointerUp(e: PointerEvent) {
    divider.releasePointerCapture(e.pointerId);
  }
  function keyDown(e: KeyboardEvent) {
    let v = split;
    const step = e.shiftKey ? 5 : 3;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") v -= step;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") v += step;
    set(v);
  }
</script>

<div
  bind:this={root}
  class="relative w-full select-none"
  style={`--split:${value}%; max-width:${typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth};`}
>
  <!-- Nachher -->
  <img src={after} alt={altAfter} class="block w-full h-auto" />

  <!-- Vorher mit Clip -->
  <div
    class="absolute inset-0 overflow-hidden"
    style="clip-path: inset(0 calc(100% - var(--split, 50%)) 0 0);"
  >
    <img src={before} alt={altBefore} class="block w-full h-auto" />
  </div>

  <!-- Divider -->
  <div
    bind:this={divider}
    class="absolute top-0 bottom-0 left-[var(--split,50%)] -translate-x-1/2 cursor-grab active:cursor-grabbing"
    role="slider"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuenow={value}
    aria-label="Vergleichsregler"
    tabindex="0"
    on:pointerdown={pointerDown}
    on:pointermove={pointerMove}
    on:pointerup={pointerUp}
    on:keydown={keyDown}
  >
  <!-- schwarze Linie (1px nach links versetzt) -->
  <div class="absolute top-0 bottom-0 left-[calc(50%-1px)] w-[2px] bg-black z-20"></div>
  <!-- weiße Linie (1px nach rechts versetzt) -->
  <div class="absolute top-0 bottom-0 left-[calc(50%+1px)] w-[2px] bg-white z-30"></div>
  <!-- unsichtbare Grab-Zone -->
  <div class="absolute top-0 bottom-0 left-1/2 w-[30px] -translate-x-1/2 bg-transparent cursor-inherit z-10"></div>
  </div>
</div>
