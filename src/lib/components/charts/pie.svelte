<script lang="ts">
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";

    let pieChartCanvas;
    Chart.register(...registerables);

    onMount(() => {
        new Chart(pieChartCanvas, {
            type: "pie",
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
                datasets: [
                    {
                        data: [10, 20, 30, 15, 25],
                        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#8e44ad"],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                    },
                },
            },
        });
    });
</script>

<canvas bind:this={pieChartCanvas}></canvas>