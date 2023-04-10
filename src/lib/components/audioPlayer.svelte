<script>
	import { fade } from 'svelte/transition';
	import { Button } from 'carbon-components-svelte';
	import Play from 'carbon-icons-svelte/lib/Play.svelte';
	import Pause from 'carbon-icons-svelte/lib/Pause.svelte';

	// public props
	export let src;
	export let autoPlay;

	// local props
	let player;
	let buttonIcon = Play;

	// event handlers
	function handleClick() {
		if (player.paused === false) {
			player.pause();
			buttonIcon = Play;
		} else {
			player.play();
			buttonIcon = Pause;
		}
	}

	function handleOnPlay() {
		buttonIcon = Pause;
	}

	function handleEnded() {
		buttonIcon = Play;
	}
</script>

<div>
	{#if src === null}
		<div class="no-audio-div">
			<h6>Not available</h6>
		</div>
	{:else}
		<audio
			bind:this={player}
			{src}
			on:ended={handleEnded}
			autoplay={autoPlay}
			on:play={handleOnPlay}
		/>
		<Button
			icon={buttonIcon}
			on:click={handleClick}
			iconDescription="Play/Pause"
			size="small"
			kind="secondary"
		/>
	{/if}
</div>

<style>
	.no-audio-div {
		height: 60px;
	}
</style>
