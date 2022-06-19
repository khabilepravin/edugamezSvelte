<script>
	import Header from '$lib/header/Header.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import '../app.css';
	import '../theme.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<Footer />
</footer>

<style>
	footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 60px;
		background: #6cf;
	}
</style>
