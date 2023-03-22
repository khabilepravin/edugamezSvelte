<script>
	import Header from '$lib/header/Header.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import { navigating } from '$app/stores'; 
</script>

<Header />

<main>
	<!-- {#if $navigating}
		<h2>Loading...</h2>
	{:else} -->
		<slot />
	<!-- {/if} -->
	<!-- <slot/> -->
</main>

<footer class="fixed-bottom">
	<Footer />
</footer>