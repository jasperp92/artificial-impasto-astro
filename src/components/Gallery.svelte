<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  export let path: string;
  export let type: "thumbs" | "grid" = "thumbs";
  export let maxCols: number = 4;
  export let images: { src: string; width: number; height: number }[] = [];

  let currentIndex = 0;
  let activeGallery: HTMLElement | null = null;
  let observer: IntersectionObserver | null = null;

  function showImage(gallery: HTMLElement, idx: number) {
    currentIndex = idx;
    const bigImages = gallery.querySelectorAll<HTMLImageElement>("img[data-index]");
    const buttons = gallery.querySelectorAll<HTMLButtonElement>("button[data-index]");

    bigImages.forEach((img) => {
      img.classList.toggle("opacity-100", parseInt(img.dataset.index!) === idx);
      img.classList.toggle("opacity-0", parseInt(img.dataset.index!) !== idx);
    });

    buttons.forEach((b) => b.classList.remove("opacity-100"));
    if (buttons[idx]) buttons[idx].classList.add("opacity-100");
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!activeGallery) return;
    const bigImages = activeGallery.querySelectorAll("img[data-index]");
    const buttons = activeGallery.querySelectorAll("button[data-index]");

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (currentIndex + 1) % bigImages.length;
      showImage(activeGallery, next);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (currentIndex - 1 + bigImages.length) % bigImages.length;
      showImage(activeGallery, prev);
    }
  }

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeGallery = entry.target as HTMLElement;
            currentIndex = 0;
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll<HTMLElement>("[id^='gallery-']").forEach((gallery) => {
      observer!.observe(gallery);

      const buttons = gallery.querySelectorAll<HTMLButtonElement>("button[data-index]");
      buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.index!);
          showImage(gallery, idx);
          activeGallery = gallery;
        });
      });

      if (buttons.length > 0) {
        showImage(gallery, 0);
      }
    });

    window.addEventListener("keydown", handleKeydown);
  });

  onDestroy(() => {
    if (observer) observer.disconnect();
    window.removeEventListener("keydown", handleKeydown);
  });

  const gridClasses = `grid gap-2 grid-cols-${maxCols} sm:grid-cols-${Math.max(
    1,
    maxCols - 1
  )} md:grid-cols-${Math.max(1, maxCols - 2)} lg:grid-cols-${Math.max(
    1,
    maxCols - 3
  )} xl:grid-cols-${maxCols}`;
</script>

<div id={"gallery-" + path} class="w-full mb-8">
  {#if type === "grid"}
    <div class={gridClasses}>
      {#each images as img}
        <img src={img.src} alt="" loading="lazy" decoding="async" class="w-full h-auto object-cover" />
      {/each}
    </div>
  {:else}
    <div
      class="relative w-full mb-1"
      style={`aspect-ratio: ${images[0]?.width} / ${images[0]?.height};`}
    >
      {#each images as img, i}
        <img
          src={img.src}
          alt=""
          class={`absolute inset-0 m-auto max-h-full max-w-full object-contain transition ${
            i === 0 ? "opacity-100" : "opacity-0"
          }`}
          data-index={i}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      {/each}
    </div>

    <div class="flex flex-wrap gap-1">
      {#each images as img, i}
        <button
          type="button"
          class="flex-shrink-0 cursor-pointer opacity-50 border-transparent"
          data-index={i}
        >
          <img src={img.src} alt="" loading="lazy" decoding="async" class="block w-32 h-24 object-cover" />
        </button>
      {/each}
    </div>
  {/if}
</div>
