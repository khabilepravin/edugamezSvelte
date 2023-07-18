<script>
	export let resultEntry;
</script>

{#if resultEntry.isCorrect === false}
	{#each resultEntry.exactDifference as char, i}
		<span class="font-bold" class:text-red-800={resultEntry.exactDifference[i] === 'x'}>
			{resultEntry.userAnswer[i] === undefined ? '_' : resultEntry.userAnswer[i]}
		</span>
	{/each}
{/if}

{#if resultEntry.isCorrect}
	{#each resultEntry.actualWord as char, i}
		<span class="font-bold">
			{char}
		</span>
	{/each}
{/if}
