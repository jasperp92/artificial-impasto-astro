<script>
    import Chart from "@components/Chart.svelte";

    // Eingabeparameter
    let images = 1000;

    // Ölfarbe
    let mlPerImage = 2.56; // ml Farbe pro Bild
    let co2ePerLiter = 2.5; // kg CO2e / Liter

    // KI-Generierung
    let secondsPerImage = 20; // Generierungszeit pro Panel
    let gpuWatt = 400; // Watt GPU
    let co2ePerKWh = 0.427; // kg CO2e pro kWh (dt. Strommix inkl. Vorketten)

    // KI-Training
    let trainingHours = 20; // Trainingsdauer in Stunden

    // Stromkosten
    let stromKostenCt = 35; // Cent pro kWh

    // === Berechnungen ===

    // 1. Ölfarbe
    $: totalMl = mlPerImage * images;
    $: totalLiters = totalMl / 1000;
    $: co2Oil = totalLiters * co2ePerLiter;

    // 2. Generierung
    $: totalSeconds = images * secondsPerImage;
    $: kWhGen = (gpuWatt * totalSeconds) / (1000 * 3600);
    $: co2Gen = kWhGen * co2ePerKWh;

    // Energie pro Bild (Wh)
    $: whPerImage = (gpuWatt * secondsPerImage) / 3600;

    // 3. Training
    $: kWhTrain = (gpuWatt * trainingHours) / 1000;
    $: co2Train = kWhTrain * co2ePerKWh;

    // Gesamtsumme
    $: kWhTotal = kWhGen + kWhTrain;
    $: kostenEuro = (kWhTotal * stromKostenCt) / 100;

    // Vergleichswerte
    const whHandy = 10;   // Handyladung ~10 Wh
    const whTee = 33;     // Wasserkocher für eine Tasse Tee ~33 Wh

    $: imagesPerHandy = whHandy / whPerImage;
    $: imagesPerTee = whTee / whPerImage;

    // === Chart-Daten ===
    $: data = {
        labels: ["Ölfarbe", "Generierung", "Training"],
        datasets: [
            {
                label: "CO₂e (kg)",
                data: [co2Oil, co2Gen, co2Train],
                backgroundColor: ["#333", "#666", "#999"],
                showPercentage: false,
            },
        ],
    };

    const options = {
        responsive: true,
        showTotal: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                display: true,
                color: "white",
                anchor: "center",
                align: "center",
                font: { weight: "bold" },
                formatter: (value) => {
                    if (value >= 10) {
                        return Math.round(value) + " kg";
                    } else if (value >= 1) {
                        return value.toFixed(1) + " kg";
                    } else {
                        return value.toFixed(2) + " kg";
                    }
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "kg CO₂e" },
            },
        },
    };
</script>

<!-- Eingaben -->

<!-- <h4>Bilder gesamt:</h4> -->
<div class="grid-layout-3">
    <label>    
        Bilder gesamt:   
        <input type="number" bind:value={images} step="100" class="border p-1 w-full" />
    </label>
        </div>
    <!-- <h4>Farbe:</h4> -->
<div class="grid-layout-3">
    <label>
        ml Farbe pro Bild:
        <input
            type="number"
            bind:value={mlPerImage}
            step="0.01"
            class="border p-1 w-full"
        />
    </label>
    <label>
        CO₂e Herstellung Ölfarbe (kg/L):
        <input
            type="number"
            bind:value={co2ePerLiter}
            step="0.1"
            class="border p-1 w-full"
        />
    </label>
        <label>
        CO₂e Strommix (kg/kWh):
        <input
            type="number"
            bind:value={co2ePerKWh}
            step="0.001"
            class="border p-1 w-full"
        />
    </label>
    </div>

        <!-- <h4>Bildgenerierung:</h4> -->
<div class="grid-layout-3">
    <label>
        Sekunden pro Bild (Generierung):
        <input
            type="number"
            bind:value={secondsPerImage}
            class="border p-1 w-full"
        />
    </label>
    <label>
        GPU Watt:
        <input type="number" bind:value={gpuWatt} step="10" class="border p-1 w-full" />
    </label>

    <label>
        Trainingsdauer (h):
        <input
            type="number"
            bind:value={trainingHours}
            class="border p-1 w-full"
        />
    </label>
    </div>

<!-- Chart -->
<div class="max-w-full mx-auto">
    <Chart type="bar" {data} {options} />
</div>

<h2>Stromverbrauch</h2>

<div class="grid gap-2 grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center text-center">
<div>Bildgenerierung:<br /><p class="text-3xl">{kWhGen.toFixed(1)} kWh</p></div>
<div class="text-2xl">+</div>
<div>Training:<br /><p class="text-4xl">{kWhTrain.toFixed(1)} kWh</p></div>
<div class="text-2xl">=</div>
<div>Gesamt:<br /><p class="text-4xl">{kWhTotal.toFixed(1)} kWh</p></div>
</div>
<br />
<!-- <p>Das kostet bei <input
        type="number"
        bind:value={stromKostenCt}
        class="w-12"
    />ct/kWh ungefähr <strong>{kostenEuro.toFixed(2)} €</strong></p>

    <br /> 
<p> -->

    <div class="text-2xl my-4">
        <div class="flex inline-flex items-center">
<svg fill="none" class="w-35 h-35" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M6 3h12v18H6V3zm10 16V5h-2v2h-4V5H8v14h8zm-5-4h2v2h-2v-2z" fill="currentColor"/> </svg><div>Der Energiebedarf einer Handyladung (10 Wh) entspricht ungefähr der Generierung von 
<strong>{imagesPerHandy.toFixed(1)} Bildern</strong>,...  </div></div>
<div class="flex gap-2 inline-flex items-center">
    <div>
...oder das Erhitzen des Wassers für eine Tasse Tee (ca. 33 Wh) entspricht in etwa dem Generieren von <strong>{imagesPerTee.toFixed(1)} Bildern</strong>.
</div>
<svg fill="none" class="w-35 h-35" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M7 3H5v4h2V3zm4 0H9v4h2V3zm2 0h2v4h-2V3zm8 6H3v12h14v-5h4V9zm-2 5h-2v-3h2v3zM5 11h10v8H5v-8z" fill="currentColor"/> </svg>
</div>
</div>