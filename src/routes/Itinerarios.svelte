<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '../lib/components/ui/card/index.js';
    import { chartCommonOptions, chartColors } from '../lib/utils/chartUtils'
	import Chart from 'chart.js/auto';

	let selectedProfile: string = 'Programador Junior';
	let userProgress: Record<string, number> = {};
	let profileData = {
		'Programador Junior': {
			skills: {
				'HTML/CSS': 60,
				JavaScript: 80,
				React: 60,
				'Vue.js': 60
			},
			objectives: [
				'Completar curso de JavaScript avanzado',
				'Crear proyectos usando React y Vue.js',
				'Aprender conceptos de Git y control de versiones'
			]
		},
		'Full-Stack Developer': {
			skills: {
				React: 100,
				'Node.js': 100,
				MongoDB: 60,
				'Express.js': 60,
				PostgreSQL: 60,
				GraphQL: 40
			},
			objectives: [
				'Desarrollar una aplicación con GraphQL y React',
				'Aprender Docker y Kubernetes',
				'Implementar SSR con Next.js y una API en Express'
			]
		},
		'Data Scientist': {
			skills: {
				Python: 80,
				'Machine Learning': 60,
				Pandas: 60,
				TensorFlow: 60,
				AWS: 40
			},
			objectives: [
				'Completar un proyecto de análisis predictivo',
				'Implementar un modelo de deep learning en TensorFlow',
				'Crear dashboard interactivo con Plotly/Dash'
			]
		}
	};

	// Chart instances
	let progressChart: Chart | null = null;
	let profileColors = {
		'Programador Junior': '#4F46E5',
		'Full-Stack Developer': '#7C3AED',
		'Data Scientist': '#2563EB'
	};

	async function loadUserProgress() {
		userProgress = profileData[selectedProfile]?.skills || {};
		renderCharts();
	}

	function renderCharts() {
		if (!Object.keys(userProgress).length) return;
		if (progressChart) progressChart.destroy();
		
		// Personalizar colores basados en el perfil seleccionado
		const currentColor = profileColors[selectedProfile] || chartColors.progress.border;
		
		progressChart = new Chart(document.getElementById('progressChart') as HTMLCanvasElement, {
			type: 'radar',
			data: {
				labels: Object.keys(userProgress),
				datasets: [
					{
						label: 'Tu progreso',
						data: Object.values(userProgress),
						backgroundColor: `${currentColor}33`, // Color con transparencia
						borderColor: currentColor,
						borderWidth: 2,
						pointBackgroundColor: currentColor,
						pointRadius: 4
					}
				]
			},
			options: { 
				...chartCommonOptions,
				plugins: {
					legend: {
						labels: {
							font: {
								family: "'Inter', sans-serif",
								size: 14
							},
							color: '#4B5563'
						}
					}
				},
				scales: {
					r: {
						angleLines: {
							color: '#E5E7EB'
						},
						grid: {
							color: '#E5E7EB'
						},
						pointLabels: {
							font: {
								size: 12,
								family: "'Inter', sans-serif"
							},
							color: '#4B5563'
						},
						ticks: {
							backdropColor: 'transparent',
							color: '#6B7280'
						}
					}
				}
			}
		});
	}

	onMount(loadUserProgress);
</script>

<div class="p-6 max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg">
	<h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Dashboard de Desarrollo Profesional</h1>
	
	<div class="grid gap-6 md:grid-cols-4">
		<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-100 dark:border-gray-700">
			<Card.Header class="pb-2">
				<Card.Title class="text-lg font-semibold text-gray-800 dark:text-gray-200">
					Perfil Profesional
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="relative">
					<select 
						bind:value={selectedProfile} 
						on:change={loadUserProgress}
						class="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
					>
						{#each Object.keys(profileData) as profile}
							<option>{profile}</option>
						{/each}
					</select>
					<div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
						<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="md:col-span-3 shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-100 dark:border-gray-700">
			<Card.Header class="pb-2">
				<Card.Title class="text-lg font-semibold text-gray-800 dark:text-gray-200">
					Progreso hacia {selectedProfile}
				</Card.Title>
				<Card.Description class="text-gray-500 dark:text-gray-400">
					Visualización de tus habilidades actuales
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="h-64 w-full">
					<canvas id="progressChart"></canvas>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<div class="grid gap-6 md:grid-cols-2 mt-6">
		<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-100 dark:border-gray-700">
			<Card.Header class="pb-2">
				<Card.Title class="text-lg font-semibold text-gray-800 dark:text-gray-200">
					Habilidades Adquiridas
				</Card.Title>
				<Card.Description class="text-gray-500 dark:text-gray-400">
					Nivel de dominio actual
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					{#each Object.entries(profileData[selectedProfile]?.skills || {}) as [skill, value]}
						<div>
							<div class="flex justify-between mb-1">
								<span class="text-sm font-medium text-gray-700 dark:text-gray-300">{skill}</span>
								<span class="text-sm font-medium text-gray-700 dark:text-gray-300">{value}%</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
								<div 
									class="h-2.5 rounded-full" 
									style={`width: ${value}%; background-color: ${profileColors[selectedProfile] || '#4F46E5'}`}>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root class="shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-100 dark:border-gray-700">
			<Card.Header class="pb-2">
				<Card.Title class="text-lg font-semibold text-gray-800 dark:text-gray-200">
					Próximos objetivos
				</Card.Title>
				<Card.Description class="text-gray-500 dark:text-gray-400">
					Metas para alcanzar el siguiente nivel
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<ul class="space-y-3">
					{#each profileData[selectedProfile]?.objectives || [] as objective, i}
						<li class="flex items-start">
							<div class="flex-shrink-0 h-5 w-5 rounded-full mr-2" style={`background-color: ${profileColors[selectedProfile] || '#4F46E5'}`}>
								<span class="flex h-full w-full items-center justify-center text-xs text-white font-bold">{i+1}</span>
							</div>
							<span class="text-gray-600 dark:text-gray-300">{objective}</span>
						</li>
					{/each}
				</ul>
			</Card.Content>
		</Card.Root>
	</div>
</div>