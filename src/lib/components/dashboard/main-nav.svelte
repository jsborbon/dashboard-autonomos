<script lang="ts">
	import { cn } from "$lib/utils.js";

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
	<a href="/" class="hover:text-primary text-sm font-medium transition-colors">
		Overview
	</a>

	<a
		href="/"
		class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
	>
		Customers
	</a>
	<a
		href="/"
		class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
	>
		Products
	</a>
	<a
		href="/"
		class="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
	>
		Settings
	</a>

</nav>
