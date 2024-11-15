<script>
	import { spellingUserAnswers } from '$lib/store/answersStore';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import WordDiff from '$lib/components/worddiff.svelte';

	let correctAnswers = $spellingUserAnswers.filter((word) => word.isCorrect);
	let isEverythingCorrect = $spellingUserAnswers.length === correctAnswers.length;

	console.log(JSON.stringify($spellingUserAnswers));

	function handleRepeatClick() {
		goto('/');
	}
</script>

<main>
	<div class="container text-center" transition:fade|global>
		{#if isEverythingCorrect}
			<div class="row row-cols-1">
				<div class="col">
					<h3>Well Done! Everything was spelled correctly.</h3>
				</div>
			</div>
		{/if}
		<div class="table-container">
			<!-- Native Table Element -->
			<table class="table table-hover">
				<tbody>
					<tr>
						<td><i class="fa fa-sheet-plastic" /></td>
						<td><i class="fa fa-book" /></td>
						<td><i class="fa fa-user" /></td>
					</tr>
					{#each $spellingUserAnswers as result}
						<tr>
							<td><i class={result.isCorrect ? 'fa fa-check' : 'fa fa-xmark'} /></td>
							<td
								>{#each result.actualWord as char, i}
									<span class="font-bold">
										{char}
									</span>
								{/each}</td
							>
							<td><WordDiff resultEntry={result} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div>
			<!-- <Button size="small" icon={Repeat} on:click={handleRepeatClick}>Repeat</Button> -->
			<button type="button" class="btn variant-filled m-2" on:click={handleRepeatClick}
				><i class="fa fa-repeat pe-2" />Repeat</button
			>
		</div>
	</div>
</main>
