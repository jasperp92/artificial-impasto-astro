<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Chart from "chart.js/auto";
    import ChartDataLabels from "chartjs-plugin-datalabels";

    Chart.register(ChartDataLabels);

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
        return ["bar", "line", "radar"].includes(type);
    }

    // Graustufen-Helfer
    function grayShades(count: number, offset = 0, start = 180, range = 150) {
        return Array.from({ length: count }, (_, i) => {
            const v = Math.round(
                start - i * (range / Math.max(1, count - 1)) - offset,
            );
            return `rgb(${v}, ${v}, ${v})`;
        });
    }

    // Gesamt berechnen (Summe nur aus erstem Dataset wie bisher)
    const total = $derived(
        data?.datasets?.[0]?.data?.reduce(
            (sum: number, v: number) => sum + v,
            0,
        ) ?? 0,
    );

    onMount(() => {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // globale Defaults
        Chart.defaults.font.size = 16;
        Chart.defaults.font.family = "Basic, sans-serif";
        Chart.defaults.elements.arc.borderWidth = 0;

        // Farben zuweisen je nach Typ
        if (type === "pie") {
            const shades = grayShades(data.labels.length);
            data.datasets.forEach((ds: any) => {
                if (!ds.backgroundColor) {
                    ds.backgroundColor = shades;
                }
            });
        } else if (
            type === "bar" &&
            (options?.scales?.x?.stacked || options?.scales?.y?.stacked)
        ) {
            data.datasets.forEach((ds: any, i: number) => {
                if (!ds.backgroundColor) {
                    ds.backgroundColor = grayShades(data.datasets.length, 0)[i];
                }
            });
        } else if (type === "bar") {
            data.datasets.forEach((ds: any) => {
                if (!ds.backgroundColor) {
                    ds.backgroundColor = "#888888"; // Default für normale Bar-Charts
                }
            });
        }

        chart = new Chart(ctx, {
            type,
            data: toPlain(data),
            options: {
                ...toPlain(options),
                color: getColor(),
                plugins: {
                    ...toPlain(options.plugins),
                    legend: {
                        display:
                            options?.plugins?.legend?.display ??
                            !(type === "bar" &&
                              !(options?.scales?.x?.stacked || options?.scales?.y?.stacked)),
                    },
                    datalabels: {
                        display: options?.plugins?.datalabels?.display ?? true,
                        color: options?.plugins?.datalabels?.color ?? getColor(),
                        anchor: "center",
                        align: "center",
                        font: { weight: "bold" },
                        formatter: (value: number, ctx: any) => {
                            if (value === 0) return null;

                            const ds = ctx.dataset;
                            if (ds.showPercentage === false) {
                                return value;
                            }

                            const dataset = ctx.chart.data.datasets[0]
                                .data as number[];
                            const total = dataset.reduce((sum, v) => sum + v, 0);
                            if (total === 0) return null;

                            const percentage = (value / total) * 100;
                            return `${Math.round(percentage)}%`;
                        },
                    },
                },
                ...(needsScales(type) && {
                    scales: {
                        x: {
                            ...options?.scales?.x,
                            grid: { display: false, ...(options?.scales?.x?.grid ?? {}) },
                            ticks: { color: getColor(), ...(options?.scales?.x?.ticks ?? {}) },
                        },
                        y: {
                            ...options?.scales?.y,
                            grid: { display: false, ...(options?.scales?.y?.grid ?? {}) },
                            ticks: { color: getColor(), ...(options?.scales?.y?.ticks ?? {}) },
                        },
                    },
                }),
            },
        });

        // Darkmode-Observer
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

    // Update bei Datenänderungen
    $effect(() => {
        if (chart && data) {
            chart.data.labels = [...data.labels];

            if (type === "pie") {
                data.datasets.forEach((ds: any) => {
                    if (!ds.backgroundColor) {
                        ds.backgroundColor = grayShades(data.labels.length);
                    }
                });
            } else if (
                type === "bar" &&
                (options?.scales?.x?.stacked || options?.scales?.y?.stacked)
            ) {
                data.datasets.forEach((ds: any, i: number) => {
                    if (!ds.backgroundColor) {
                        ds.backgroundColor = grayShades(
                            data.datasets.length,
                            0,
                        )[i];
                    }
                });
            } else if (type === "bar") {
                data.datasets.forEach((ds: any) => {
                    if (!ds.backgroundColor) {
                        ds.backgroundColor = "#888888";
                    }
                });
            }

            data.datasets.forEach((ds: any, i: number) => {
                if (chart.data.datasets[i]) {
                    chart.data.datasets[i].data = [...ds.data];
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
    {#if options?.showTotal !== false && data?.datasets?.[0]?.showTotal !== false}
        <p class="mt-2 font-bold">
            Gesamt: {total}
        </p>
    {/if}
    <canvas bind:this={canvas} class="{className} block w-full h-auto"></canvas>
</div>
