<script>
	import { spellingUserAnswers } from '$lib/store/answersStore';	
	import { fade } from 'svelte/transition';
	import { Tag, Button } from 'carbon-components-svelte';
	import { goto } from '$app/navigation';
	import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import Repeat from 'carbon-icons-svelte/lib/Repeat.svelte';
	import WordDiff from '$lib/components/worddiff.svelte';

	let correctAnswers = $spellingUserAnswers.filter((word) => word.isCorrect);
	let isEverythingCorrect = $spellingUserAnswers.length === correctAnswers.length;

	console.log(JSON.stringify($spellingUserAnswers));

	function handleRepeatClick() {
		goto('/');
	}
</script>

<main>
	<div class="container text-center" transition:fade>
		<div class="row row-cols-1">
			<div class="col"><h5>Results</h5></div>
		</div>

		{#if isEverythingCorrect}
			<div class="row row-cols-1">
				<div class="col">
					<h3>Well Done! Everything was spelled correctly.</h3>
				</div>
			</div>
		{:else}
			<div class="row row-cols-2">
				<div class="col">You Spelled</div>
				<div class="col">Correct Spelling</div>
			</div>

			{#each $spellingUserAnswers as result}
			{#if result.isCorrect === false}
			<WordDiff resultEntry={result}/>
			{/if}
				<!-- <div class="row row-cols-2">
					<div class="col">
						<Tag
							icon={result.isCorrect ? Checkmark : Close}
							type={result.isCorrect ? 'green' : 'red'}
						>
							<span class={result.isCorrect ? '' : 'font-weight-bold'}
								>{result.userAnswer ? result.userAnswer : '--'}</span
							>
						</Tag>
					</div>
					<div class="col">
						{#if !result.isCorrect}
							<Tag type="green" icon={Checkmark}
								><span class="font-weight-bold">{result.actualWord}</span></Tag
							>
						{/if}
					</div>
				</div> -->
			{/each}
		{/if}
		<div>
			<Button size="small" icon={Repeat} on:click={handleRepeatClick}>Repeat</Button>
		</div>
	</div>
</main>
