<script>
	import "carbon-components-svelte/css/white.css";
	import Header from '$lib/header/Header.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import { navigating } from '$app/stores';
	import { loading } from '$lib/store/loadingStore';

	$: $loading = !!$navigating;
</script>

<Header />

<main>
	<div>
		{#if $loading}
			<span class="loader"></span>
		{/if}
		<slot />
	</div>
</main>

<footer class="fixed-bottom">
	<Footer />
</footer>

<style>
	
	.loader {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		position: fixed;
		top: 50%;
		left: 50%;
		margin-left: -50px;
		margin-top: -50px;
		background-size: 100%;
		animation: rotate 1s linear infinite;
		z-index: 1440;
	}
	.loader::before,
	.loader::after {
		content: '';
		box-sizing: border-box;
		position: absolute;
		inset: 0px;
		border-radius: 50%;
		border: 5px solid blue;
		animation: prixClipFix 2s linear infinite;
	}
	.loader::after {
		inset: 8px;
		transform: rotate3d(90, 90, 0, 180deg);
		border-color: #ff3d00;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes prixClipFix {
		0% {
			clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
		}
		50% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
		}
		75%,
		100% {
			clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
		}
	}
</style>
