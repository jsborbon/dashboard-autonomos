<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Loader } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { auth } from '$lib/stores/firebase.js';
	import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
	import { user } from '$lib/stores/store.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let email: string = '';
	let password: string = '';
	let isLoading = false;
	let errorMessage: string | null = null;
	let showPassword = false;
	let isPasswordVisible = false;
	const provider = new GoogleAuthProvider();

	async function loginWithGoogle() {
		isLoading = true;
		errorMessage = null;
		try {
			const result = await signInWithPopup(auth, provider);
			console.log("Usuario autenticado con Google:", result.user);
			await goto('/'); // Redirige a la raíz
		} catch (error) {
			console.error("Error al iniciar sesión con Google:", error);
			errorMessage = "Hubo un error al iniciar sesión con Google. Intenta de nuevo.";
		} finally {
			isLoading = false;
		}
	}

	async function loginWithEmail() {
		isLoading = true;
		errorMessage = null;
		try {
			const result = await signInWithEmailAndPassword(auth, email, password);
			console.log("Usuario autenticado con email:", result.user);
			await goto('/'); // Redirige a la raíz
		} catch (error) {
			console.error("Error al iniciar sesión con email:", error);
			errorMessage = "Hubo un error al iniciar sesión. Verifica tu correo o contraseña.";
		} finally {
			isLoading = false;
		}
	}

	function handleContinue() {
		if (!email) {
			errorMessage = "Por favor ingresa tu dirección de email.";
			return;
		}
		showPassword = true;
	}


</script>

<div class="flex flex-col justify-between min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
	<div class="flex-grow flex items-center justify-center p-4">
		<div
			class="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden"
			in:fade={{ duration: 300 }}
		>
			<div class="pt-8 pb-4 px-8 text-center">
				<div class="flex justify-center mb-3">
					<img
						src="logo.jpeg"
						alt="Autonomos portal"
						class="h-56 w-56 rounded-full flex items-center justify-center"
					/>
				</div>
				<h2 class="text-xl font-semibold text-gray-800 mb-1">Iniciar sesión</h2>
				<p class="text-gray-500 text-sm">
					Bienvenido de nuevo! Por favor inicia sesión para continuar
				</p>
			</div>

			<!-- Cuerpo del formulario -->
			<div class="px-8 pb-6">
				{#if errorMessage}
					<div
						class="mb-4 py-2 px-3 bg-red-50 border border-red-100 rounded-md text-sm text-red-600"
					>
						{errorMessage}
					</div>
				{/if}

				<Button
					type="button"
					on:click={loginWithGoogle}
					variant="outline"
					class="flex items-center w-full justify-center py-2 border border-gray-300 rounded-md text-gray-600 bg-gray-50 transition"
					disabled={isLoading}
				>
					<svg class="h-5 w-5 mr-2" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
						<path
							fill="#EA4335"
							d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
						></path>
						<path
							fill="#4285F4"
							d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
						></path>
						<path
							fill="#FBBC05"
							d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
						></path>
						<path
							fill="#34A853"
							d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
						></path>
					</svg>
					Google
				</Button>

				<!-- Separador -->
				<div class="relative my-6">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-200"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-2 bg-white text-gray-500">o</span>
					</div>
				</div>

				<form
					on:submit|preventDefault={showPassword ? loginWithEmail : handleContinue}
					class="space-y-4"
				>
					<div>
						<Label for="email" class="block text-sm font-medium text-gray-700 mb-1"
							>Correo electrónico</Label
						>
						<Input
							id="email"
							type="email"
							placeholder="Ingresa tu dirección de correo"
							bind:value={email}
							class="w-full border-gray-300 rounded-md bg-gray-50 text-gray-700"
							required
							disabled={isLoading}
						/>
					</div>

					{#if showPassword}
						<div>
							<Label for="password" class="block text-sm font-medium text-gray-700 mb-1"
								>Contraseña</Label
							>
							<div class="relative">
								<Input
									id="password"
									type={isPasswordVisible ? 'text' : 'password'}
									placeholder="••••••••"
									bind:value={password}
									class="w-full border-gray-300 rounded-md pr-10 bg-gray-50 text-gray-700"
									required
									disabled={isLoading}
								/>
								<button
									type="button"
									class="absolute inset-y-0 right-0 flex items-center pr-3"
									on:click={() => (isPasswordVisible = !isPasswordVisible)}
									disabled={isLoading}
									aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
								>
									{#if isPasswordVisible}
										<!-- Eye open icon -->
										<svg
											class="h-5 w-5 text-gray-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									{:else}
										<svg
											class="h-5 w-5 text-gray-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M6.58 6.58l10.86 10.86M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									{/if}
								</button>
							</div>
						</div>
					{/if}

					<Button
						type="submit"
						class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition"
						disabled={isLoading}
					>
						{#if isLoading}
							<Loader class="mr-2 h-4 w-4 animate-spin" />
							<span>Procesando...</span>
						{:else}
							<span>Continuar {showPassword ? '' : '→'}</span>
						{/if}
					</Button>
				</form>
			</div>
		</div>
	</div>
</div>
