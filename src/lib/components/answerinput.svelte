<script>
	import { createEventDispatcher } from 'svelte';
	import { letters } from '../store/currentWordLetters';

	let currentLetters = [];

	letters.subscribe((value) => {
		currentLetters = value;
		ClearOldValues();
	});

	const answeredEventDispatcher = createEventDispatcher();

	function KeyupHandler(e) {
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

	function KeypressHandler(e) {
		if (!onlyLetters(e.key)) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	function onlyLetters(str) {
		return /^[A-Za-z]*$/.test(str);
	}

	function ClearOldValues() {
		const inputs = document.getElementsByName('answerChars');
		inputs.forEach((input) => {
			input.value = '';
		});
	}
</script>

<div>
	{#each currentLetters as { letter }, i}
		<input
			type="text"
			maxlength="1"
			id={i}
			name="answerChars"
			on:keyup={KeyupHandler}
			on:keypress={KeypressHandler}
		/>
	{/each}
</div>

<style>
	input {
		margin: 0 0.5rem;
		padding: 0.5rem;
		border: 1px solid #333;
		width: 50px;
		height: 50px;
		text-align: center;
		font-size: 3rem;
	}
</style>
