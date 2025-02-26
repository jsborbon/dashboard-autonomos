<script lang="ts">
    import Activity from "lucide-svelte/icons/activity";
    import CreditCard from "lucide-svelte/icons/credit-card";
    import DollarSign from "lucide-svelte/icons/dollar-sign";
    import Download from "lucide-svelte/icons/download";
    import Users from "lucide-svelte/icons/users";
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";
    import {
        DashboardMainNav,
        Barchart,
        Linechart,
        Piechart,
        RecentSales,
        Search,
        TeamSwitcher,
        UserNav,
    } from "$lib/components/dashboard/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import DatePickerWithRange from "$lib/components/date-picker-with-range.svelte";
    import { ModeToggle } from "$lib/components/index.js";


    let selectedProfile: string = "Programador Junior";
    let userProgress: Record<string, number> = {};
    let invoiceData: { months: string[]; income: number[]; expenses: number[] } = {
        months: [],
        income: [],
        expenses: []
    };
    let progressChart: Chart | null = null;
    let invoiceChart: Chart | null = null;

    function loadDemoData() {
        // Datos simulados de progreso profesional
        userProgress = {
            "Frontend": 80,
            "Backend": 60,
            "Bases de Datos": 50,
            "DevOps": 30,
            "Testing": 40
        };

        // Datos simulados de facturación
        invoiceData = {
            months: ["Enero", "Febrero", "Marzo", "Abril"],
            income: [5000, 7000, 6000, 8000],
            expenses: [2000, 2500, 2200, 3000]
        };

        renderCharts();
    }

    function renderCharts() {
        // Gráfico de progreso profesional
        if (progressChart) progressChart.destroy();
        progressChart = new Chart(document.getElementById("progressChart"), {
            type: "radar",
            data: {
                labels: Object.keys(userProgress),
                datasets: [{
                    label: "Tu progreso",
                    data: Object.values(userProgress),
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2
                }]
            }
        });

        // Gráfico de ingresos/gastos
        if (invoiceChart) invoiceChart.destroy();
        invoiceChart = new Chart(document.getElementById("invoiceChart"), {
            type: "bar",
            data: {
                labels: invoiceData.months,
                datasets: [
                    {
                        label: "Ingresos",
                        data: invoiceData.income,
                        backgroundColor: "rgba(75, 192, 192, 0.6)"
                    },
                    {
                        label: "Gastos",
                        data: invoiceData.expenses,
                        backgroundColor: "rgba(255, 99, 132, 0.6)"
                    }
                ]
            }
        });
    }

    onMount(loadDemoData);

</script>

<div class="hidden flex-col md:flex bg-gray-100 dark:bg-gray-900">
    <div class="border-b bg-white dark:bg-gray-800 shadow-sm">
        <div class="flex h-16 items-center px-4">
            <TeamSwitcher />
            <DashboardMainNav class="mx-6" />
            <div class="ml-auto flex items-center space-x-4">
                <Search />
                <ModeToggle />
                <UserNav />
            </div>
        </div>
    </div>

    <div class="flex-1 space-y-4 p-8 pt-6">
        <div class="flex items-center justify-between space-y-2">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Dashboard</h2>
            <div class="flex items-center space-x-2">
                <DatePickerWithRange />
                <Button size="sm" class="bg-indigo-500 text-white hover:bg-indigo-600">
                    <Download class="mr-2 h-4 w-4" />
                    Download
                </Button>
            </div>
        </div>

        <Tabs.Root value="itinerarios" class="space-y-4">
            <Tabs.List class="flex space-x-4 border-b">
                <Tabs.Trigger value="itinerarios" class="text-gray-600 hover:text-indigo-600">Itinerarios</Tabs.Trigger>
                <Tabs.Trigger value="facturas" class="text-gray-600 hover:text-indigo-600">Facturación</Tabs.Trigger>
                <Tabs.Trigger value="overview" class="text-gray-600 hover:text-indigo-600">Overview</Tabs.Trigger>
                <Tabs.Trigger value="analytics" disabled class="text-gray-400">Analytics</Tabs.Trigger>
                <Tabs.Trigger value="reports" disabled class="text-gray-400">Reports</Tabs.Trigger>
                <Tabs.Trigger value="notifications" disabled class="text-gray-400">Notifications</Tabs.Trigger>
            </Tabs.List>

            <!-- Sección de Itinerarios Profesionales -->
            <Tabs.Content value="itinerarios" class="space-y-4">
                <div class="flex space-x-4">
                    <select bind:value={selectedProfile} on:change={loadDemoData} class="p-2 border rounded">
                        <option>Programador Junior</option>
                        <option>Full-Stack Developer</option>
                        <option>Data Scientist</option>
                    </select>
                </div>
                <Card.Root class="p-4 bg-white shadow-lg">
                    <Card.Header>
                        <Card.Title>Progreso hacia {selectedProfile}</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <canvas id="progressChart"></canvas>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>

            <!-- Sección de Facturación -->
            <Tabs.Content value="facturas" class="space-y-4">
                <div class="flex items-center space-x-2">
                    <DatePickerWithRange />
                    <Button size="sm" class="bg-indigo-500 text-white">Filtrar</Button>
                </div>
                <Card.Root class="p-4 bg-white shadow-lg">
                    <Card.Header>
                        <Card.Title>Resumen de Facturación</Card.Title>
                    </Card.Header>
                    <Card.Content>
                        <canvas id="invoiceChart"></canvas>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>

            <!-- Sección de Overview -->
            <Tabs.Content value="overview" class="space-y-4">
                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card.Root class="shadow-lg bg-white hover:shadow-xl transition-shadow">
                        <Card.Header class="flex flex-row items-center justify-between pb-2">
                            <Card.Title class="text-sm font-medium text-gray-800">Total Revenue</Card.Title>
                            <DollarSign class="text-gray-600 h-4 w-4" />
                        </Card.Header>
                        <Card.Content>
                            <div class="text-2xl font-bold text-indigo-500">$45,231.89</div>
                            <p class="text-gray-500 text-xs">+20.1% from last month</p>
                        </Card.Content>
                    </Card.Root>

                    <Card.Root class="shadow-lg bg-white hover:shadow-xl transition-shadow">
                        <Card.Header class="flex flex-row items-center justify-between pb-2">
                            <Card.Title class="text-sm font-medium text-gray-800">Subscriptions</Card.Title>
                            <Users class="text-gray-600 h-4 w-4" />
                        </Card.Header>
                        <Card.Content>
                            <div class="text-2xl font-bold text-green-500">+2350</div>
                            <p class="text-gray-500 text-xs">+180.1% from last month</p>
                        </Card.Content>
                    </Card.Root>

                    <Card.Root class="shadow-lg bg-white hover:shadow-xl transition-shadow">
                        <Card.Header class="flex flex-row items-center justify-between pb-2">
                            <Card.Title class="text-sm font-medium text-gray-800">Sales</Card.Title>
                            <CreditCard class="text-gray-600 h-4 w-4" />
                        </Card.Header>
                        <Card.Content>
                            <div class="text-2xl font-bold text-blue-500">+12,234</div>
                            <p class="text-gray-500 text-xs">+19% from last month</p>
                        </Card.Content>
                    </Card.Root>

                    <Card.Root class="shadow-lg bg-white hover:shadow-xl transition-shadow">
                        <Card.Header class="flex flex-row items-center justify-between pb-2">
                            <Card.Title class="text-sm font-medium text-gray-800">Active Now</Card.Title>
                            <Activity class="text-gray-600 h-4 w-4" />
                        </Card.Header>
                        <Card.Content>
                            <div class="text-2xl font-bold text-yellow-500">+573</div>
                            <p class="text-gray-500 text-xs">+201 since last hour</p>
                        </Card.Content>
                    </Card.Root>
                </div>

                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card.Root class="col-span-4 shadow-lg bg-white hover:shadow-xl transition-shadow">
                        <Card.Header>
                            <Card.Title class="text-gray-800">Overview</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <Barchart />

                            <Linechart />
                        </Card.Content>
                    </Card.Root>

                    <Card.Root class="col-span-3 shadow-lg bg-white hover:shadow-xl transition-shadow">
                        <Card.Header>
                            <Card.Title class="text-gray-800">Recent Sales</Card.Title>
                            <Card.Description class="text-sm text-gray-600">You made 265 sales this month.</Card.Description>
                        </Card.Header>
                        <Card.Content>
                            <RecentSales />

                            <Piechart />

                        </Card.Content>
                    </Card.Root>
                </div>
            </Tabs.Content>
        </Tabs.Root>
    </div>
</div>