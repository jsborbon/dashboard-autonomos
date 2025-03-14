<script lang="ts">
    import { onMount } from 'svelte';
    import * as Card from '../lib/components/ui/card/index.js';
    import { chartCommonOptions, chartColors } from '../lib/utils/chartUtils';
    import Chart from 'chart.js/auto';
    import { goto } from '$app/navigation';
    import { auth, db } from '$lib/stores/firebase.js';
    import { collection, getDocs } from 'firebase/firestore';

    export let dateRange: { from?: Date; to?: Date };

    let selectedProfile: string = 'Programador Junior';
    let userProgress: Record<string, number> = {};
    let userProjects = [];

    $: if (dateRange) {
        if (dateRange.from && dateRange.to) {
            filterProjectsByDateRange();
        }
    }

    function filterProjectsByDateRange() {
        const from = new Date(dateRange.from);
        const to = new Date(dateRange.to);

        // Set time to start and end of day for more accurate comparison
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);

        // Filter projects based on date range
        userProjects = userProjects.filter(project => {
            // Handle both Timestamp and string date formats
            const projectDate = project.fecha?.toDate ? 
                project.fecha.toDate() : 
                new Date(project.fecha);

            if (!projectDate || isNaN(projectDate.getTime())) {
                console.warn('Invalid date for project:', project.id);
                return false;
            }

            projectDate.setHours(12, 0, 0, 0); // Normalize time to noon
            return projectDate >= from && projectDate <= to;
        });

        // Update charts with filtered data
        renderCharts();
    }

    let profileData = {
        "Programador Junior": {
            "skills": {
                "HTML/CSS": 2,
                "JavaScript": 3,
                "React": 2,
                "Vue.js": 2
            },
            "objectives": [
                "Aprender los fundamentos de JavaScript",
                "Crear pequeños proyectos en React y Vue.js",
                "Familiarizarse con Git y control de versiones"
            ]
        },
        "Frontend Developer": {
            "skills": {
                "React": 4,
                "Vue.js": 4,
                "Angular": 3,
                "Svelte": 2,
                "Next.js": 2
            },
            "objectives": [
                "Construir una aplicación con Next.js",
                "Crear una SPA con Vue.js o Angular",
                "Mejorar el rendimiento con optimización de código"
            ]
        },
        "Backend Developer": {
            "skills": {
                "Node.js": 4,
                "Express.js": 3,
                "Spring Boot": 3,
                "Django": 2,
                "Flask": 2
            },
            "objectives": [
                "Crear una API básica con Node.js",
                "Aprender autenticación con OAuth/JWT",
                "Familiarizarse con despliegue en servidores"
            ]
        },
        "Full-Stack Developer": {
            "skills": {
                "React": 4,
                "Node.js": 4,
                "MongoDB": 3,
                "Express.js": 2,
                "PostgreSQL": 2,
                "GraphQL": 2
            },
            "objectives": [
                "Desarrollar una aplicación simple con GraphQL y React",
                "Aprender conceptos básicos de Docker",
                "Implementar SSR con Next.js"
            ]
        },
        "Mobile Developer": {
            "skills": {
                "Flutter": 3,
                "React Native": 3,
                "iOS": 2,
                "Firebase": 2
            },
            "objectives": [
                "Crear una pequeña app con Flutter",
                "Aprender Swift o Kotlin",
                "Explorar almacenamiento en Firebase"
            ]
        },
        "DevOps Engineer": {
            "skills": {
                "Docker": 3,
                "AWS": 3,
                "CI/CD": 2,
                "Terraform": 2,
                "Kubernetes": 2
            },
            "objectives": [
                "Automatizar despliegues simples",
                "Aprender a usar Terraform",
                "Implementar pipelines básicos en CI/CD"
            ]
        },
        "Data Scientist": {
            "skills": {
                "Python": 3,
                "Machine Learning": 2,
                "Pandas": 2,
                "TensorFlow": 2,
                "AWS": 2
            },
            "objectives": [
                "Realizar análisis de datos básicos",
                "Aprender los fundamentos de Machine Learning",
                "Explorar modelos de predicción con TensorFlow"
            ]
        }
    };

    let progressChart: Chart | null = null;
    let profileColors = {
        'Programador Junior': '#4F46E5',
        'Full-Stack Developer': '#7C3AED'
    };

    async function loadProjectData() {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                console.error('Usuario no autenticado');
                await goto('/login');
                return;
            }

            const userId = currentUser.uid;
            const proyectosRef = collection(db, 'usuarios', userId, 'proyectos');
            const proyectosSnapshot = await getDocs(proyectosRef);

            if (proyectosSnapshot.empty) {
                console.log('No hay proyectos disponibles');
                return;
            }

            userProjects = proyectosSnapshot.docs.map(doc => doc.data());
            renderCharts();
        } catch (error) {
            console.error('Error al cargar los proyectos:', error);
        }
    }

    async function loadUserProgress() {
        await loadProjectData();
        userProgress = profileData[selectedProfile]?.skills || {};
        renderCharts();
    }

    function renderCharts() {
        if (!Object.keys(userProgress).length) return;
        if (progressChart) progressChart.destroy();
        const currentColor = profileColors[selectedProfile] || chartColors.progress.border;
        progressChart = new Chart(document.getElementById('progressChart') as HTMLCanvasElement, {
            type: 'radar',
            data: {
                labels: Object.keys(userProgress),
                datasets: [{
                    label: 'Tu progreso',
                    data: Object.values(userProgress),
                    backgroundColor: `${currentColor}33`,
                    borderColor: currentColor,
                    borderWidth: 2,
                    pointBackgroundColor: currentColor,
                    pointRadius: 4
                }]
            },
            options: {...chartCommonOptions, scales: {
        r: { 
            ticks: {
                display: false 
            }
        }
    }
                    }
        });
    }

    onMount(loadUserProgress);
</script>

<div class="p-6 mx-auto bg-gray-50 dark:bg-gray-900 rounded-lg">
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