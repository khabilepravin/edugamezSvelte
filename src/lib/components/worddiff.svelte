<script>
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	export let resultEntry;
</script>

<div>
	<h3>
		<Checkmark/>
		{#each resultEntry.actualWord as char, i}
			<span class="originalword">
				{char}
			</span>
		{/each}
	</h3>

	<h3>
		<Close/>
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
	.originalword{
		color:green;
	}
</style>
