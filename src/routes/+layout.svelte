<script lang="ts">
	import "../styles/globals.css";
	import { Toaster as DefaultSonner } from "$lib/components/ui/sonner/index.js";

</script>

	<DefaultSonner />


<div class="bg-background relative flex min-h-screen flex-col" id="page" data-vaul-drawer-wrapper>
	<div class="flex-1">
		<slot />
	</div>

</div>
