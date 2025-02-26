<script lang="ts">
	import { onMount } from "svelte";
	import { Chart, registerables } from "chart.js";

	let barChartCanvas;
	Chart.register(...registerables);

	const data = [
		{ name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
		{ name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
		{ name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
		{ name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
		{ name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
		{ name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
		{ name: "Jul", total: Math.floor(Math.random() * 5000) + 1000 },
		{ name: "Aug", total: Math.floor(Math.random() * 5000) + 1000 },
		{ name: "Sep", total: Math.floor(Math.random() * 5000) + 1000 },
		{ name: "Oct", total: Math.floor(Math.random() * 5000) + 1000 },
		{ name: "Nov", total: Math.floor(Math.random() * 5000) + 1000 },
		{ name: "Dec", total: Math.floor(Math.random() * 5000) + 1000 },
	];

	onMount(() => {
		new Chart(barChartCanvas, {
			type: "bar",
			data: {
				labels: data.map((d) => d.name),
				datasets: [
					{
						label: "Total Sales",
						data: data.map((d) => d.total),
						backgroundColor: "rgba(54, 162, 235, 0.6)",
						borderColor: "rgba(54, 162, 235, 1)",
						borderWidth: 1,
						borderRadius: 5,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: {
						grid: { display: false },
					},
					y: {
						beginAtZero: true,
						grid: { color: "rgba(200, 200, 200, 0.3)" },
					},
				},
				plugins: {
					legend: { display: false },
				},
			},
		});
	});
</script>

<div class="chart-container">
	<canvas bind:this={barChartCanvas}></canvas>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 350px;
		position: relative;
	}
</style>