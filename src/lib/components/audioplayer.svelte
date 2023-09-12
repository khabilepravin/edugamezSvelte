<script>
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import {createEventDispatcher } from 'svelte';

	// public props
	export let src;
	export let autoPlay;
	export let playerText;

	const dispatch = createEventDispatcher();
	
	// local props
	let player;
	let buttonIcon = 'fa fa-play';
	let loadingAudio = true;

	export const handleResetAudio = () => {
		loadingAudio = true;
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
		dispatch('startedPlaying', {});
	}

    function handleEnded() {
		buttonIcon = 'fa fa-play';

	}

	function handleCanPlayThrough() {
		loadingAudio = false;
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
			on:canplaythrough={handleCanPlayThrough}
		/>
		<button
			type="button"
			on:click={handleClick}
			class="btn btn-sm variant-filled"
			disabled={loadingAudio}
		>
			{#if loadingAudio}
				<ProgressRadial
					...
					stroke={80}
					meter="stroke-secondary-500"
					track="stroke-secondary-500/30"
					width="w-4"
				/>
			{:else}
				<i class={buttonIcon} />
			{/if}<span class="ps-1">{playerText}</span></button
		>
	{/if}
</div>

<style>
	.no-audio-div {
		height: 60px;
	}
</style>
