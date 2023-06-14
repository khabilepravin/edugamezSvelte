<script>
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import AudioPlayer from '$lib/components/audioPlayer.svelte';
	export let resultEntry;
</script>

<div>
	<h3>
		<Checkmark />
		{#each resultEntry.actualWord as char, i}
			<span class="originalword">
				{char}
			</span>
		{/each}
	</h3>
	<div class="row">
		<div class="col">
			<h6>Word</h6>
		</div>
		<div class="col">
			<h6>Definition</h6>
		</div>
		<div class="col">
			<h6>Example</h6>
		</div>
	</div>
	<div class="row">
		<div class="col">
			<AudioPlayer src={resultEntry.wordAudioUrl} />
		</div>
		<div class="col">
			<AudioPlayer src={resultEntry.definitonAudioUrl} />
		</div>
		<div class="col">
			<AudioPlayer src={resultEntry.exampleAudioUrl} />
		</div>
	</div>
	<h3>
		<Close />
		{#each resultEntry.exactDifference as char, i}
			<span class="correct" class:danger={resultEntry.exactDifference[i] === 'x'}>
				{resultEntry.userAnswer[i] === undefined ? '_' : resultEntry.userAnswer[i]}
			</span>
		{/each}
	</h3>
</div>

<style>
	.danger {
		color: red;
		font-weight: bold;
	}
	.correct {
		padding: 2;
	}
	.originalword {
		color: green;
	}
</style>
