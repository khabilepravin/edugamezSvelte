<script>
	import { spellingUserAnswers } from '$lib/store';
	import { fade } from 'svelte/transition';
</script>

<main>
	<div class="container text-center" transition:fade>
		<div class="row row-cols-1">
			<div class="col"><h5>Results</h5></div>
		</div>
		<div class="row row-cols-2">
			<div class="col">Correct Spelling</div>
			<div class="col">You Spelled</div>
		</div>

		{#each $spellingUserAnswers as result}
			<div class="row row-cols-2">
				<div class="col text-primary">{result.actualWord}</div>
				<div
					class={result.isCorrect ? 'col text-success' : 'col text-danger strikethrough-decoration'}
				>
					{result.userAnswer ? result.userAnswer : '--'}
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
	.strikethrough-decoration {
		text-decoration: line-through;
	}
</style>
