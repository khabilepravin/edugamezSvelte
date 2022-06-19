<script>
	import Header from '$lib/header/Header.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	// import '../app.css';
	// import '../theme.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<Footer />
</footer>

<style>
	main {
		padding-top: 4%;
		height: 50%;
	}
</style>
