<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Chart from "chart.js/auto";
    import ChartDataLabels from "chartjs-plugin-datalabels";

    Chart.register(ChartDataLabels); // 👈 Plugin registrieren

    const {
        type = "bar",
        data,
        options = {},
        heightClass = "h-64 md:h-80",
        className = "",
    } = $props();

    let canvas: HTMLCanvasElement;
    let chart: Chart | undefined;

    const toPlain = <T,>(v: T): T => {
        try {
            return structuredClone(v);
        } catch {
            return JSON.parse(JSON.stringify(v));
        }
    };

    function getColor() {
        return document.documentElement.classList.contains("dark")
            ? "white"
            : "black";
    }

    function applyColor() {
        const color = getColor();
        if (chart) {
            chart.options.color = color;
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach((scale: any) => {
                    if (scale.ticks) scale.ticks.color = color;
                });
            }
            chart.update();
        }
    }

    function needsScales(type: string) {
        return ["bar", "line", "radar"].includes(type); // alles mit Achsen
    }

    // Gesamt berechnen
    const total = $derived(
        data?.datasets?.[0]?.data?.reduce(
            (sum: number, v: number) => sum + v,
            0,
        ) ?? 0,
    );

    onMount(() => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // deine Font bleibt hier gesetzt
        Chart.defaults.font.size = 16;
        Chart.defaults.font.family = "Basic, sans-serif";
        Chart.defaults.elements.arc.borderWidth = 0;

        chart = new Chart(ctx, {
            type,
            data: toPlain(data),
            options: {
                ...toPlain(options),
                color: getColor(),
                ...((type === "bar" || type === "pie") && {
                    plugins: {
                        legend: { display: type !== "bar" }, // Legende bei Pie an, bei Bar aus
                        datalabels: {
                            color: getColor(),
                            anchor: type === "pie" ? "center" : "center",
                            align: type === "pie" ? "center" : "center",
                            font: { weight: "bold" },
                            formatter: (value: number, ctx: any) => {
                                if (value === 0) return null; // 👈 keine Anzeige bei 0
                                const dataset = ctx.chart.data.datasets[0]
                                    .data as number[];
                                const total = dataset.reduce(
                                    (sum, v) => sum + v,
                                    0,
                                );
                                if (total === 0) return null;
                                const percentage = (value / total) * 100;
                                return `${Math.round(percentage)}%`; // 👈 gerundet
                            },
                        },
                    },
                }),
                ...(needsScales(type) && {
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { color: getColor() },
                        },
                        y: {
                            grid: { display: false },
                            ticks: { color: getColor() },
                        },
                    },
                }),
            },
        });

        // reagiert auf Darkmode-Class
        const observer = new MutationObserver(() => applyColor());
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => {
            observer.disconnect();
            chart?.destroy();
        };
    });

    // Werte und Labels im Dataset ändern
    $effect(() => {
        if (chart && data) {
            // Labels aktualisieren
            chart.data.labels = [...data.labels];

            // Werte aktualisieren
            data.datasets.forEach((ds: any, i: number) => {
                if (chart.data.datasets[i]) {
                    chart.data.datasets[i].data = [...ds.data];
                    if (ds.backgroundColor) {
                        chart.data.datasets[i].backgroundColor = [
                            ...ds.backgroundColor,
                        ];
                    }
                    if (ds.label) {
                        chart.data.datasets[i].label = ds.label;
                    }
                }
            });

            chart.update({
                duration: 1000,
                easing: "easeInOutCubic",
            });
        }
    });

    onDestroy(() => chart?.destroy());
</script>

<div class="relative w-[87vw] md:w-full">
    <p class="mt-2 font-bold">
        Gesamt: {total}
    </p>
    <canvas bind:this={canvas} class="{className} block w-full h-auto"></canvas>
</div>
