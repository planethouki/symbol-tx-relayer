<script>
	import {
		Collapse,
		Navbar,
		NavbarToggler,
		Nav,
		NavItem,
	} from 'sveltestrap';
	import { link } from 'svelte-spa-router'

	export let segment;

	let isOpen = false;

	function handleUpdate(event) {
		isOpen = event.detail.isOpen;
	}
</script>

<style>
</style>

<Navbar color="light" light expand="md">
	<a class="navbar-brand" href="/" use:link>
		Home
	</a>
	<NavbarToggler on:click={() => (isOpen = !isOpen)} />
	<Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
		<Nav class="ml-auto" navbar>
			<NavItem active='{segment === "/metadata"}'>
				<a class="nav-link" href="/metadata" use:link>metadata</a>
			</NavItem>
		</Nav>
	</Collapse>
</Navbar>

