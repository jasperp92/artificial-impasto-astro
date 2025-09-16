<script lang="ts">
  import Chart from "@components/Chart.svelte";
  import Compare from "@components/Compare.svelte";
  import data1 from "../data/data_1.json";
  import data2 from "../data/data_2.json";
  import fullpagedigital from "@images/survey/fullpage_digital.jpg";
  import fullpageki from "@images/survey/fullpage_ki.jpg";
  import fullpageoil from "@images/survey/fullpage_oil.jpg";

  let showFirst = true;

  // Aspect Ratio aus den Bilddaten
  const ratio = `${fullpagedigital.width}/${fullpagedigital.height}`;
</script>


{#if showFirst}
  <h3>Vergleich Digital und Öl</h3>
{:else}
  <h3>Vergleich Digital und KI</h3>
{/if}

<button
  on:click={() => (showFirst = !showFirst)}
  class="px-3 border-1 cursor-pointer py-1 rounded"
>
  {showFirst ? "Vergleich mit Öl" : "Vergleich mit Digital"}
</button>

Welches Bild gefällt dir besser? 

<!-- Chart -->
<Chart
  key={showFirst}
  type="pie"
  data={showFirst ? data1 : data2}
  options={{ responsive: true }}
  className="max-w-110 mx-auto"
/>

<br />

<!-- Responsive Wrapper mit fester Aspect Ratio -->
<div class="relative w-full max-w-[1100px] mx-auto">
  <Compare 
    before={fullpageki.src} 
    after={showFirst ? fullpagedigital.src : fullpageoil.src} 
    class="absolute inset-0" 
  />
</div>
