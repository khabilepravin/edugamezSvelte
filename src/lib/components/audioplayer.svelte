<script>
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { createEventDispatcher, onMount } from 'svelte';

	// public props
	/** @type {{src: any, autoPlay: any, playerText: any, playbackRate: any}} */
	let {
		src,
		autoPlay,
		playerText,
		playbackRate = $bindable(),
		startedPlaying
	} = $props();

	//const dispatch = createEventDispatcher();

	// local props
	let player = $state();
	let buttonIcon = $state('fa fa-play');
	let loadingAudio = $state(true);

	export const handleResetAudio = () => {
		loadingAudio = true;
		player.pause();
		player.currentTime = 0;
		buttonIcon = 'fa fa-play';
	};

	export const playAudio = () => {
		player.play();
		buttonIcon = 'fa fa-pause'
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
		//dispatch('startedPlaying', {});
		startedPlaying();
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
			bind:playbackRate
			onended={handleEnded}
			autoplay={autoPlay}
			onplay={handleOnPlay}
			oncanplaythrough={handleCanPlayThrough}
		></audio>

		<button
			type="button"
			onclick={handleClick}
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
				<i class={buttonIcon}></i>
			{/if}<span class="ps-1">{playerText}</span></button
		>
	{/if}
</div>

<style>
	.no-audio-div {
		height: 60px;
	}
</style>
