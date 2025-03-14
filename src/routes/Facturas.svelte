<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '../lib/components/ui/card/index.js';
	import type { InvoiceData, TaxComparison, DateChangeEvent } from '$lib/types';
	import Chart from 'chart.js/auto';
	import { chartCommonOptions, chartColors } from '../lib/utils/chartUtils'
	import { goto } from '$app/navigation';
	import { auth, db } from '$lib/stores/firebase.js';
	import { collection, query, orderBy, getDocs } from 'firebase/firestore';

	// Total amounts
	let totalIncome = 0;
	let totalExpenses = 0;
	let netProfit = 0;

	// Map to store monthly income and expenses
	let incomeMap: Record<string, number> = {};
	let expenseMap: Record<string, number> = {};

	// Date range for filtering
	let dateRange: { from?: Date; to?: Date } = {};

	let invoiceData: InvoiceData = { months: [], income: [], expenses: [] };
	let invoiceStats = { emitted: 0, received: 0, total: 0 };
	let emitterDistribution: Record<string, number> = {};
	let taxComparison: TaxComparison = { base: [], iva: [] };

	// Map to store revenue data by emitter and receiver
	let emitterRevenue: Record<string, number> = {};
	let receiverRevenue: Record<string, number> = {};

	// Chart instances
	let progressChart: Chart | null = null;
	let invoiceChart: Chart | null = null;
	let invoiceTypeChart: Chart | null = null;
	let emitterChart: Chart | null = null;
	let taxChart: Chart | null = null;
	let companyRevenueChart: Chart | null = null;
	let billingByCompanyChart: Chart | null = null;

	// Función para renderizar los gráficos con opciones mejoradas
	function renderCharts() {
		if (!invoiceData.months.length) return;

		// Gráfico de ingresos vs gastos (línea)
		if (invoiceChart) invoiceChart.destroy();
		if (invoiceData.months.length) {
			invoiceChart = new Chart(document.getElementById('invoiceChart') as HTMLCanvasElement, {
				type: 'line',
				data: {
					labels: invoiceData.months,
					datasets: [
						{
							label: 'Ingresos',
							data: invoiceData.income,
							borderColor: chartColors.income.border,
							backgroundColor: chartColors.income.background,
							fill: true,
							tension: 0.4,
							pointRadius: 4,
							pointHoverRadius: 6
						},
						{
							label: 'Gastos',
							data: invoiceData.expenses,
							borderColor: chartColors.expense.border,
							backgroundColor: chartColors.expense.background,
							fill: true,
							tension: 0.4,
							pointRadius: 4,
							pointHoverRadius: 6
						}
					]
				},
				options: {
					...chartCommonOptions,
					scales: {
						x: {
							grid: {
								display: false
							}
						},
						y: {
							beginAtZero: true,
							ticks: {
								callback: function (value) {
									return value + ' €';
								}
							}
						}
					},
					interaction: {
						intersect: false,
						mode: 'index'
					},
					plugins: {
						...chartCommonOptions.plugins,
						tooltip: {
							...chartCommonOptions.plugins.tooltip,
							callbacks: {
								label: function (context) {
									let label = context.dataset.label || '';
									if (label) {
										label += ': ';
									}
									if (context.parsed.y !== null) {
										label += new Intl.NumberFormat('es-ES', {
											style: 'currency',
											currency: 'EUR'
										}).format(context.parsed.y);
									}
									return label;
								}
							}
						}
					}
				}
			});
		}

		// Gráfico de facturas emitidas vs recibidas (pie)
		if (invoiceTypeChart) invoiceTypeChart.destroy();
		if (invoiceStats.total) {
			invoiceTypeChart = new Chart(
				document.getElementById('invoiceTypeChart') as HTMLCanvasElement,
				{
					type: 'doughnut',
					data: {
						labels: ['Emitidas', 'Recibidas'],
						datasets: [
							{
								data: [invoiceStats.emitted, invoiceStats.received],
								backgroundColor: [chartColors.emitted.background, chartColors.received.background],
								hoverOffset: 10,
								borderWidth: 1,
								borderColor: '#fff'
							}
						]
					},
					options: {
						...chartCommonOptions,
						cutout: '60%',
						plugins: {
							...chartCommonOptions.plugins,
							tooltip: {
								...chartCommonOptions.plugins.tooltip,
								callbacks: {
									label: function (context) {
										const label = context.label || '';
										const value = context.raw as number;
										const percentage = Math.round((value / invoiceStats.total) * 100);
										return `${label}: ${value} (${percentage}%)`;
									}
								}
							}
						}
					}
				}
			);
		}

		// Gráfico de distribución por emisor (horizontal bar)
		if (emitterChart) emitterChart.destroy();
		const emitterKeys = Object.keys(emitterDistribution);
		if (emitterKeys.length) {
			// Sort by number of invoices in descending order
			const sortedEmitters = emitterKeys.sort(
				(a, b) => emitterDistribution[b] - emitterDistribution[a]
			);
			// Limit to top 5 for better visualization
			const topEmitters = sortedEmitters.slice(0, 5);

			emitterChart = new Chart(document.getElementById('emitterChart') as HTMLCanvasElement, {
				type: 'bar',
				data: {
					labels: topEmitters,
					datasets: [
						{
							label: 'Facturas',
							data: topEmitters.map((emisor) => emitterDistribution[emisor]),
							backgroundColor: chartColors.emitter.background,
							borderRadius: 5
						}
					]
				},
				options: {
					...chartCommonOptions,
					indexAxis: 'y',
					scales: {
						y: {
							grid: {
								display: false
							}
						},
						x: {
							beginAtZero: true,
							ticks: {
								precision: 0
							}
						}
					},
					plugins: {
						...chartCommonOptions.plugins,
						subtitle: {
							display: true,
							text: 'Top 5 emisores',
							font: {
								size: 14
							},
							padding: {
								bottom: 10
							}
						}
					}
				}
			});
		}

		// Gráfico de comparación Base Imponible vs IVA (stacked bar)
		if (taxChart) taxChart.destroy();
		if (taxComparison.base.length) {
			taxChart = new Chart(document.getElementById('taxChart') as HTMLCanvasElement, {
				type: 'bar',
				data: {
					labels: invoiceData.months,
					datasets: [
						{
							label: 'Base Imponible',
							data: taxComparison.base,
							backgroundColor: chartColors.tax.base,
							borderRadius: 5
						},
						{
							label: 'IVA',
							data: taxComparison.iva,
							backgroundColor: chartColors.tax.iva,
							borderRadius: 5
						}
					]
				},
				options: {
					...chartCommonOptions,
					scales: {
						x: {
							grid: {
								display: false
							}
						},
						y: {
							beginAtZero: true,
							ticks: {
								callback: function (value) {
									return value + ' €';
								}
							}
						}
					},
					plugins: {
						...chartCommonOptions.plugins,
						tooltip: {
							...chartCommonOptions.plugins.tooltip,
							callbacks: {
								label: function (context) {
									let label = context.dataset.label || '';
									if (label) {
										label += ': ';
									}
									if (context.parsed.y !== null) {
										label += new Intl.NumberFormat('es-ES', {
											style: 'currency',
											currency: 'EUR'
										}).format(context.parsed.y);
									}
									return label;
								}
							}
						}
					}
				}
			});
		}

		// Gráfico de facturación por Empresa/Receptor (bar)
		if (companyRevenueChart) companyRevenueChart.destroy();
		const emitterRevenueKeys = Object.keys(emitterRevenue);
		if (emitterRevenueKeys.length) {
			// Sort companies by total revenue (emitted + received)
			const sortedCompanies = emitterRevenueKeys.sort((a, b) => {
				const totalA = (emitterRevenue[a] || 0) + (receiverRevenue[a] || 0);
				const totalB = (emitterRevenue[b] || 0) + (receiverRevenue[b] || 0);
				return totalB - totalA;
			});

			// Limit to top 5 for clarity
			const topCompanies = sortedCompanies.slice(0, 5);

			companyRevenueChart = new Chart(
				document.getElementById('companyRevenueChart') as HTMLCanvasElement,
				{
					type: 'bar',
					data: {
						labels: topCompanies,
						datasets: [
							{
								label: 'Ingresos',
								data: topCompanies.map((company) => emitterRevenue[company] || 0),
								backgroundColor: chartColors.emitted.background,
								borderRadius: {
									topLeft: 5,
									topRight: 5,
									bottomLeft: 0,
									bottomRight: 0
								}
							},
							{
								label: 'Gastos',
								data: topCompanies.map((company) => receiverRevenue[company] || 0),
								backgroundColor: chartColors.received.background,
								borderRadius: {
									topLeft: 5,
									topRight: 5,
									bottomLeft: 0,
									bottomRight: 0
								}
							}
						]
					},
					options: {
						...chartCommonOptions,
						scales: {
							x: {
								grid: {
									display: false
								}
							},
							y: {
								beginAtZero: true,
								ticks: {
									callback: function (value) {
										return value + ' €';
									}
								}
							}
						},
						plugins: {
							...chartCommonOptions.plugins,
							subtitle: {
								display: true,
								text: 'Top 5 empresas por facturación total',
								font: {
									size: 14
								},
								padding: {
									bottom: 10
								}
							},
							tooltip: {
								...chartCommonOptions.plugins.tooltip,
								callbacks: {
									label: function (context) {
										let label = context.dataset.label || '';
										if (label) {
											label += ': ';
										}
										if (context.parsed.y !== null) {
											label += new Intl.NumberFormat('es-ES', {
												style: 'currency',
												currency: 'EUR'
											}).format(context.parsed.y);
										}
										return label;
									}
								}
							}
						}
					}
				}
			);
		}

		// Gráfico de Facturación por Tipo de Factura y Empresa (stacked)
		if (billingByCompanyChart) billingByCompanyChart.destroy();
		const companyKeys = [
			...new Set([...Object.keys(emitterRevenue), ...Object.keys(receiverRevenue)])
		];

		if (companyKeys.length) {
			// Sort companies by total billing in descending order
			const sortedCompanies = companyKeys.sort((a, b) => {
				const totalA = (emitterRevenue[a] || 0) + (receiverRevenue[a] || 0);
				const totalB = (emitterRevenue[b] || 0) + (receiverRevenue[b] || 0);
				return totalB - totalA;
			});

			// Limit to top 7 for better visualization
			const topCompanies = sortedCompanies.slice(0, 7);

			billingByCompanyChart = new Chart(
				document.getElementById('billingByCompanyChart') as HTMLCanvasElement,
				{
					type: 'bar',
					data: {
						labels: topCompanies,
						datasets: [
							{
								label: 'Emitidas',
								data: topCompanies.map((company) => emitterRevenue[company] || 0),
								backgroundColor: chartColors.emitted.background,
								borderRadius: {
									topLeft: 5,
									topRight: 0,
									bottomLeft: 5,
									bottomRight: 0
								}
							},
							{
								label: 'Recibidas',
								data: topCompanies.map((company) => receiverRevenue[company] || 0),
								backgroundColor: chartColors.received.background,
								borderRadius: {
									topLeft: 0,
									topRight: 5,
									bottomLeft: 0,
									bottomRight: 5
								}
							}
						]
					},
					options: {
						...chartCommonOptions,
						scales: {
							x: {
								stacked: true,
								grid: {
									display: false
								}
							},
							y: {
								stacked: true,
								beginAtZero: true,
								ticks: {
									callback: function (value) {
										return value + ' €';
									}
								}
							}
						},
						plugins: {
							...chartCommonOptions.plugins,
							subtitle: {
								display: true,
								text: 'Top 7 empresas',
								font: {
									size: 14
								},
								padding: {
									bottom: 10
								}
							},
							tooltip: {
								...chartCommonOptions.plugins.tooltip,
								callbacks: {
									label: function (context) {
										let label = context.dataset.label || '';
										if (label) {
											label += ': ';
										}
										if (context.parsed.y !== null) {
											label += new Intl.NumberFormat('es-ES', {
												style: 'currency',
												currency: 'EUR'
											}).format(context.parsed.y);
										}
										return label;
									}
								}
							}
						}
					}
				}
			);
		}
	}

	// Carga de las facturas desde Firestore con mejor manejo de errores y filtrado
	export async function loadInvoiceData() {
		try {
			const currentUser = auth.currentUser;
			if (!currentUser) {
				console.error('Usuario no autenticado');
				await goto('/login');
				return;
			}

			const userId = currentUser.uid;
			// Use query with orderBy to get dates in chronological order
			const facturasRef = collection(db, 'usuarios', userId, 'facturas');
			const facturasQuery = query(facturasRef, orderBy('fechaEmision', 'asc'));
			const facturasSnapshot = await getDocs(facturasQuery);

			if (facturasSnapshot.empty) {
				console.log('No hay facturas disponibles');
				return;
			}

			let monthsMap = new Map();
			incomeMap = {};
			expenseMap = {};
			let emitterCount: Record<string, number> = {};
			let emittedCount = 0;
			let receivedCount = 0;
			let taxBase: number[] = [];
			let taxIVA: number[] = [];
			emitterRevenue = {};
			receiverRevenue = {};
			totalIncome = 0;
			totalExpenses = 0;

			facturasSnapshot.forEach((facturaDoc) => {
				const data = facturaDoc.data();
				if (!data.fechaEmision || !data.total) return;

				// Parse date correctly ensuring yyyy-mm-dd format
				const dateParts = data.fechaEmision.split('-');
				let dateString;

				// Handle both dd-mm-yyyy and yyyy-mm-dd formats
				if (dateParts[0].length === 4) {
					// Already in yyyy-mm-dd format
					dateString = data.fechaEmision;
				} else {
					// Convert from dd-mm-yyyy to yyyy-mm-dd
					dateString = dateParts.reverse().join('-');
				}

				const date = new Date(dateString);

				// Apply date range filtering if provided
				if (dateRange.from && date < dateRange.from) return;
				if (dateRange.to && date > dateRange.to) return;

				const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
				const month = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

				monthsMap.set(monthKey, month);

				// Process based on invoice type
				if (data.tipoFactura?.toLowerCase() === 'emitida') {
					if (data.emisor) {
						emitterRevenue[data.emisor] = (emitterRevenue[data.emisor] || 0) + data.total;
					}
					emittedCount++;
					incomeMap[monthKey] = (incomeMap[monthKey] || 0) + data.total;
					totalIncome += data.total;
				} else if (data.tipoFactura?.toLowerCase() === 'recibida') {
					if (data.receptor) {
						receiverRevenue[data.receptor] = (receiverRevenue[data.receptor] || 0) + data.total;
					}
					receivedCount++;
					expenseMap[monthKey] = (expenseMap[monthKey] || 0) + data.total;
					totalExpenses += data.total;
				}

				if (data.emisor) {
					emitterCount[data.emisor] = (emitterCount[data.emisor] || 0) + 1;
				}

				taxBase.push(data.baseImponible || 0);
				taxIVA.push(data.iva || 0);
			});

			netProfit = totalIncome - totalExpenses;

			// Sort months chronologically for proper timeline display
			const sortedMonthKeys = Array.from(monthsMap.keys()).sort();
			const sortedMonths = sortedMonthKeys.map((key) => monthsMap.get(key));

			invoiceData = {
				months: sortedMonths,
				income: sortedMonthKeys.map((key) => incomeMap[key] || 0),
				expenses: sortedMonthKeys.map((key) => expenseMap[key] || 0)
			};

			invoiceStats = {
				emitted: emittedCount,
				received: receivedCount,
				total: emittedCount + receivedCount
			};

			emitterDistribution = emitterCount;
			taxComparison = { base: taxBase, iva: taxIVA };

			renderCharts();
		} catch (error) {
			console.error('Error al obtener datos de Firestore:', error);
		}
	}

	// Update charts when date range changes
	function handleDateRangeChange(event: DateChangeEvent) {
		dateRange = event.detail;
		loadInvoiceData();
	}

	// Ejecutar al montar el componente
	onMount(async () => {
		await loadInvoiceData();
	});
</script>

<!-- Sección de Facturación -->

{#if totalIncome > 0 || totalExpenses > 0}
	<div class="grid gap-4 md:grid-cols-3">
		<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
			<Card.Header class="pb-2">
				<Card.Title class="text-sm font-medium text-gray-500 dark:text-gray-400">
					Ingresos Totales
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-green-600 dark:text-green-400">
					{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
						totalIncome
					)}
				</div>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
					Total de facturas emitidas: {invoiceStats.emitted}
				</p>
			</Card.Content>
		</Card.Root>

		<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
			<Card.Header class="pb-2">
				<Card.Title class="text-sm font-medium text-gray-500 dark:text-gray-400">
					Gastos Totales
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-bold text-red-600 dark:text-red-400">
					{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
						totalExpenses
					)}
				</div>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
					Total de facturas recibidas: {invoiceStats.received}
				</p>
			</Card.Content>
		</Card.Root>

		<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
			<Card.Header class="pb-2">
				<Card.Title class="text-sm font-medium text-gray-500 dark:text-gray-400">
					Beneficio Neto
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div
					class="text-2xl font-bold {netProfit >= 0
						? 'text-green-600 dark:text-green-400'
						: 'text-red-600 dark:text-red-400'}"
				>
					{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(netProfit)}
				</div>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
					Total facturas: {invoiceStats.total}
				</p>
			</Card.Content>
		</Card.Root>
	</div>
{:else}
	<div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
		<p class="text-gray-600 dark:text-gray-300">
			No hay datos de facturación disponibles para el período seleccionado.
		</p>
	</div>
{/if}

<div class="grid gap-4 md:grid-cols-2">
	<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
		<Card.Header>
			<Card.Title class="text-gray-800 dark:text-white flex items-center">
				<span>Evolución de Facturación</span>
			</Card.Title>
			<Card.Description class="text-gray-500 dark:text-gray-400">
				Ingresos vs gastos a lo largo del tiempo
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="h-80" aria-label="Gráfica de evolución de facturación">
				<canvas id="invoiceChart"></canvas>
			</div>
		</Card.Content>
	</Card.Root>

	<div class="grid gap-4">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
				<Card.Header class="flex flex-row items-center justify-between pb-2">
					<Card.Title class="text-sm font-medium text-gray-800 dark:text-gray-200">
						Facturas Emitidas vs Recibidas
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div aria-label="Gráfica de facturas emitidas vs recibidas">
						<canvas id="invoiceTypeChart"></canvas>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
				<Card.Header class="flex flex-row items-center justify-between pb-2">
					<Card.Title class="text-sm font-medium text-gray-800 dark:text-gray-200">
						Distribución por Emisor
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div aria-label="Gráfica de distribución por emisor">
						<canvas id="emitterChart"></canvas>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
			<Card.Header class="flex flex-row items-center justify-between">
				<Card.Title class="text-sm font-medium text-gray-800 dark:text-gray-200">
					Facturación por Empresa/Receptor
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div aria-label="Gráfica de facturación por empresa">
					<canvas id="companyRevenueChart"></canvas>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>

<div class="grid gap-4 md:grid-cols-2">
	<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
		<Card.Header class="flex flex-row items-center justify-between">
			<Card.Title class="text-sm font-medium text-gray-800 dark:text-gray-200">
				Comparación Base Imponible vs IVA
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div aria-label="Gráfica de comparación base imponible vs IVA">
				<canvas id="taxChart"></canvas>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow">
		<Card.Header>
			<Card.Title class="text-gray-800 dark:text-gray-200">
				Facturación por Empresa (Emitida vs Recibida)
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div aria-label="Gráfica de facturación por empresa (emitida vs recibida)">
				<canvas id="billingByCompanyChart"></canvas>
			</div>
		</Card.Content>
	</Card.Root>
</div>
