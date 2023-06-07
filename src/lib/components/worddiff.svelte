<script>
	export let resultEntry;
</script>

<div>
	<h2>
		{#each resultEntry.actualWord as char, i}
			<span class="originalword">
				{char}
			</span>
		{/each}
	</h2>

	<h2>
		{#each resultEntry.exactDifference as char, i}
			<span class="correct" class:danger={resultEntry.exactDifference[i] === 'x'}>
				{resultEntry.userAnswer[i] === undefined ? '_' : resultEntry.userAnswer[i]}
			</span>
		{/each}
	</h2>
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
