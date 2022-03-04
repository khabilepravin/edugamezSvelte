<script>
	import { spellingUserAnswers } from '../../../lib/store';
	import { fade } from 'svelte/transition';
</script>

<table class="table" transition:fade>
	<thead>
		<tr>
			<th scope="col">Actual Spelling</th>
			<th scope="col">You Spelled</th>
		</tr>
	</thead>
	<tbody>
		{#each $spellingUserAnswers as result}
			<tr>
				<td><h4 class="text-primary">{result.actualWord}</h4></td>
				<td><h4 class={result.isCorrect ? "text-success" : "text-danger"}>{result.userAnswer}</h4></td>
			</tr>
		{/each}
	</tbody>
</table>
