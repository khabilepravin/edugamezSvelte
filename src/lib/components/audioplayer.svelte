<script>
	import { fade } from 'svelte/transition';	

	// public props
	export let src;
	export let autoPlay;
	export let playerText;

	// local props
	let player;
	let buttonIcon = 'fa fa-play';

	export const handleResetAudio = () => {
		player.pause();
		player.currentTime = 0;
		buttonIcon = 'fa fa-play';
	};

	// event handlers
	function handleClick() {
		if (player.paused === false) {
			player.pause();
			buttonIcon = 'fa fa-play';
		} else {
			player.play();
			buttonIcon = 'fa fa-pause';
		}
	}

	function handleOnPlay() {
		buttonIcon = 'fa fa-pause';
	}

	function handleEnded() {
		buttonIcon = 'fa fa-play';
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
		<button type="button"			
			on:click={handleClick}
			class="btn btn-sm variant-filled">
		<i class={buttonIcon}></i><span class="ps-1">{playerText}</span></button>
	{/if}
</div>

<style>
	.no-audio-div {
		height: 60px;
	}
</style>
