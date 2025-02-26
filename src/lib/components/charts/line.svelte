<script lang="ts">
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";

    let lineChartCanvas;
    Chart.register(...registerables);

    onMount(() => {
        new Chart(lineChartCanvas, {
            type: "line",
            data: {
                labels: ["January", "February", "March", "April", "May"],
                datasets: [
                    {
                        label: "Sales",
                        data: [30, 50, 70, 60, 90],
                        borderColor: "#36a2eb",
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderWidth: 2,
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        grid: { display: false },
                    },
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    });
</script>

<canvas bind:this={lineChartCanvas}></canvas>