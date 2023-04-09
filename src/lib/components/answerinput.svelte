<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Button } from 'carbon-components-svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';

	export let currentLetters = [];

	export const LettersChanged = () => {
		ClearOldValues();
	};

	const answeredEventDispatcher = createEventDispatcher();

	onMount(() => {
		if (!!document) {
			const inputs = document.getElementsByName('answerChars');
			if (inputs !== undefined && inputs.length > 0) {
				inputs[0].focus();
			}
		}
	});

	function KeyupHandler(e) {
		if (!!document) {
			const input = e.currentTarget;
			const currentIndex = parseInt(e.currentTarget.id);
			const inputs = document.getElementsByName('answerChars');

			if (e.code === 'ArrowRight') {
				if (currentIndex < inputs.length - 1) {
					inputs[currentIndex + 1].focus();
					return;
				}
			}

			if (e.code === 'ArrowLeft') {
				if (currentIndex > 0) {
					inputs[currentIndex - 1].focus();
					return;
				}
			}

			if (e.code === 'Backspace') {
				if (!input.value) {
					if (currentIndex > 0) {
						inputs[currentIndex - 1].focus();
						return;
					}
				}
			}

			if (onlyLetters(input.value)) {
				if (input.value) {
					const userAnswer = [...inputs].map((input) => input.value).join('');
					if (userAnswer.length === inputs.length) {
						answeredEventDispatcher('answered', { enteredAnswer: userAnswer });
					}

					if (currentIndex !== inputs.length - 1) {
						inputs[currentIndex + 1].focus();
					}
				}
			}
		}
	}

	function KeypressHandler(e) {
		if (!onlyLetters(e.key)) {
			if (e.key === 8) {
			} else {
				e.preventDefault();
				e.stopPropagation();
			}
		}
	}

	function KeyDownHandler(e) {
		if (!!document) {
			const input = e.currentTarget;
			const currentIndex = parseInt(e.currentTarget.id);
			const inputs = document.getElementsByName('answerChars');
			if (e.key === 'Backspace') {
				if (!input.value) {
					if (currentIndex > 0) {
						inputs[currentIndex - 1].focus();
						return;
					}
				}
			}
		}
	}

	function onlyLetters(str) {
		return /^[A-Za-z]*$/.test(str);
	}

	function ClearOldValues() {
		if (!!document) {
			const inputs = document.getElementsByName('answerChars');
			if (inputs !== undefined && inputs.length > 0) {
				inputs.forEach((input) => {
					input.value = '';
				});
				inputs[0].focus();
			}
		}
	}
</script>

<div>
	{#each currentLetters as { letter }, i}
		<input
			type="text"
			maxlength="1"
			id={i}
			name="answerChars"
			autocapitalize="off"
			autocomplete="off"
			spellcheck="false"
			autocorrect="off"
			on:keyup={KeyupHandler}
			on:keypress={KeypressHandler}
			on:keydown={KeyDownHandler}
			transition:fade
		/>
	{/each}
	<Button
		kind="danger-tertiary"
		size="small"
		iconDescription="Delete"
		icon={TrashCan}
		on:click={ClearOldValues}
	/>
</div>

<style>
	input {
		margin: 0 0.5rem;
		padding: 0.3rem;
		border: 1px solid #333;
		width: 44px;
		height: 44px;
		text-align: center;
		font-size: 2rem;
	}
</style>
