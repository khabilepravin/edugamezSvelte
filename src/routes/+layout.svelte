<script>
	import "carbon-components-svelte/css/white.css";
	import Header from '$lib/header/Header.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import { navigating } from '$app/stores';
	import { loading } from '$lib/store/loadingStore';
	import { Loading } from 'carbon-components-svelte';

	$: $loading = !!$navigating;
</script>

<Header />

<main>
	<div>
		{#if $loading}
			<Loading/>
		{/if}
		<slot />
	</div>
</main>

<footer>
	<Footer />
</footer>
