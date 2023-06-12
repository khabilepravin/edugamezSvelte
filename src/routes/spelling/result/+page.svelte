<script>
	import { spellingUserAnswers } from '$lib/store/answersStore';
	import { fade } from 'svelte/transition';
	import { Tag, Button } from 'carbon-components-svelte';
	import { goto } from '$app/navigation';

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
		{#if isEverythingCorrect}
			<div class="row row-cols-1">
				<div class="col">
					<h3>Well Done! Everything was spelled correctly.</h3>
				</div>
			</div>
		{:else}
			{#each $spellingUserAnswers as result}
				{#if result.isCorrect === false}
					<WordDiff resultEntry={result} />
					<hr />
				{/if}
			{/each}
		{/if}
		<div>
			<Button size="small" icon={Repeat} on:click={handleRepeatClick}>Repeat</Button>
		</div>
	</div>
</main>

<style>
	hr {
		border: none;
		border-top: 3px double #333;
		color: #333;
		overflow: visible;
		text-align: center;
		height: 5px;
	}

	hr:after {
		background: #fff;
		content: '§';
		padding: 0 4px;
		position: relative;
		top: -13px;
	}
</style>
