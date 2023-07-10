<script>
	import { Loading } from 'carbon-components-svelte';

	export const prerender = true;
	let showLoading = true;

	function onIFrameContentLoaded(){
		console.log('something is loaded');
		showLoading = false;
	}

</script>
<svelte:head>
	<title>MaxSpelling - Feedback</title>
</svelte:head>
<div class="container">	
	<div class="row">
		<div class="col-lg-12">
			<iframe
				id="feedbackForm"
				src="https://docs.google.com/forms/d/e/1FAIpQLSdKd1HPD0VMFBU9sBzEvmDgJU8zvEHSmi2kff1QgVHliYgA1w/viewform?embedded=true"
				width="100%"
				height="900"
				frameborder="0"
				marginheight="0"
				marginwidth="0"
				on:load={onIFrameContentLoaded}>Loading…</iframe
			>

			{#if showLoading}
				<Loading />
			{/if}
		</div>
	</div>
</div>
