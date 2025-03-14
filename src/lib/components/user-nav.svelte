<script lang="ts">
	import * as DropdownMenu from "./ui/dropdown-menu/index.js";
	import * as Avatar from "./ui/avatar/index.js";
	import { Button } from "./ui/button/index.js";
	import { auth } from "../stores/firebase.js";
	import { user } from '../stores/store.js';

	function logOut() {
		auth.signOut();

	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				<Avatar.Image src="avatar.png" alt="logout" />
				<Avatar.Fallback>Logout</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{$user.displayName || 'Usuario'}</p>
				<p class="text-muted-foreground text-xs leading-none">{$user.email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />

		<DropdownMenu.Item on:click={() => logOut()}>
			Log out
			<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
