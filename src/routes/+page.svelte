<script lang="ts">
	import Download from 'lucide-svelte/icons/download';
	import { UserNav } from '../lib/components/dashboard/index.js';
	import { Button } from '../lib/components/ui/button/index.js';
	import * as Tabs from '../lib/components/ui/tabs/index.js';
	import DatePickerWithRange from '../lib/components/date-picker-with-range.svelte';
	import { ModeToggle } from '../lib/components/index.js';

	import Facturas from './Facturas.svelte';
	import Itinerarios from './Itinerarios.svelte';


</script>


<Tabs.Root value="facturas" class="space-y-4">
	<header class="border-b bg-white dark:bg-gray-800 shadow-sm">
		<div class="flex h-16 items-center px-4">
			<nav class="flex items-center space-x-4 lg:space-x-6 mx-6">
				<img src="logo.jpeg" alt="Company Logo" class="h-12 w-12" />

				<Tabs.List class="flex space-x-4 border-b">
					<Tabs.Trigger
						value="facturas"
						class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400 transition-colors"
					>
						Facturación
					</Tabs.Trigger>
					<Tabs.Trigger
						value="itinerarios"
						class="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 py-2 border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400 transition-colors"
					>
						Itinerarios
					</Tabs.Trigger>
				</Tabs.List>
			</nav>
			<div class="ml-auto flex items-center space-x-4">
				<div
					class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
				>
					<DatePickerWithRange on:change={()=>{/* handleDateRangeChange */}} />
					<Button
						size="sm"
						class="bg-indigo-500 text-white hover:bg-indigo-600"
						aria-label="Descargar Informes"
					>
						<Download class="mr-2 h-4 w-4" />
						Descargar Informes
					</Button>
				</div>
				<ModeToggle />
				<UserNav />
			</div>
		</div>
	</header>


	<div class="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 flex-1 space-y-4 p-4">
		<!-- Sección de Facturación -->
		<Tabs.Content value="facturas" class="space-y-4">
			<Facturas/>
		</Tabs.Content>

		<!-- Sección de Itinerarios Profesionales -->
		<Tabs.Content value="itinerarios" class="space-y-4">
			<Itinerarios/>
		</Tabs.Content>
	</div>
</Tabs.Root>