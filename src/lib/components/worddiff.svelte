<script>
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import UserAvatar from 'carbon-icons-svelte/lib/UserAvatar.svelte';
	import AudioPlayer from '$lib/components/audioPlayer.svelte';
	export let resultEntry;
</script>

<div class="row">
	<div class="col">
		<Checkmark />
	</div>
	<div class="col">
		<h5>
			{#each resultEntry.actualWord as char, i}
				<span class="originalword">
					{char}
				</span>
			{/each}
		</h5>
	</div>
	<div class="col">
		<AudioPlayer src={resultEntry.wordAudioUrl} />
	</div>
</div>
<div class="row">
	<div class="col">
		<UserAvatar />
	</div>
	<div class="col">
		<h5>
			{#each resultEntry.exactDifference as char, i}
				<span class="correct" class:danger={resultEntry.exactDifference[i] === 'x'}>
					{resultEntry.userAnswer[i] === undefined ? '_' : resultEntry.userAnswer[i]}
				</span>
			{/each}
		</h5>
	</div>
	<div class="col" />
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
