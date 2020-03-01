<script>
	import Router from 'svelte-spa-router'
	import { location } from 'svelte-spa-router'
	import Home from './routes/index.svelte'
	import Nav from './components/Nav.svelte'
	import Metadata from './routes/metadata.svelte'
	import { Container } from 'sveltestrap'

	const routes = {
		// Exact path
		'/': Home,
		'/metadata': Metadata
	}
</script>

<Nav segment={$location}/>
<main>
	<Container>
		<Router {routes}/>
	</Container>
</main>



<style>
</style>
