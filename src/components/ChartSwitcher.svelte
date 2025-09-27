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

<button
  on:click={() => (showFirst = !showFirst)}
  class="px-3 border-1 cursor-pointer py-1 rounded"
>
  {showFirst ? "Vergleich mit Öl" : "Vergleich mit Digital"}
</button>
<br />
<br />
<!-- Responsive Wrapper mit fester Aspect Ratio -->
<div class="relative w-full max-w-[1100px] mx-auto">
  <Compare 
    before={fullpageki.src} 
    after={showFirst ? fullpagedigital.src : fullpageoil.src} 
    class="absolute inset-0" 
  />
</div>

<br />

{#if showFirst}

<div class="comment-left">Mehr Tiefe. Wirkt echter</div>

<div class="comment-right">Mehr Fokus aufs Wesentliche</div>

<div class="comment-left">mehr dynamik </div>

<div class="comment-right">Mehr Details, weniger Unschärfe</div>

<div class="comment-left">Stil und Details  </div>


{:else}

<div class="comment-left">Einzelne panels wirken filmischer. Würde bei dieser doppelseite das panel der stiefel aus Bild 1 nehmen</div>

<div class="comment-center">Ich finde auch die ersten zwei linken Panels oben besser, also im Supermarkt oder was das ist, und das Close-Up. Aber zum Beispiel das Bild rechts vom Springerstiefel finde ich unten besser, also das mit den drei Männern, weil die Proportionen einfach anders sind. [...] also ich würde es gefühlt fast mixen. <br /><p class="citation text-right">- Birte Rauch, Illustratorin</p></div>

<div class="comment-right">Mehr Strukturen und dadurch wirkt es intensiver</div>

<div class="comment-left">Wirkt auf mich authentischer und stellenweise auch klarer. Und das ist für mich für ein Comic wichtig.</div>
{/if}