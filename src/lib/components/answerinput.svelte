<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';	

	// public props
	export let currentLetters = [];
	export let currentStateOfTheAnswer = '';

	// public funcs
	export const LettersChanged = () => {
		ClearOldValues();
		focusOnFirstIfAvailable();
	};

	// life cycle hooks
	onMount(() => {
		focusOnFirstIfAvailable();
	});

	// local event handlers
	function KeyupHandler(e) {
		if (!!document) {
			const input = e.currentTarget;
			const currentIndex = parseInt(e.currentTarget.id);
			const inputs = getAnswerInputBoxes();

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
				0;
				if (!input.value) {
					if (currentIndex > 0) {
						inputs[currentIndex - 1].focus();
						return;
					}
				}
			}

			if (onlyLetters(input.value)) {
				if (input.value) {
					// construct the answer
					currentStateOfTheAnswer = [...inputs].map((input) => input.value).join('');

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
			const inputs = getAnswerInputBoxes();
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
		const inputs = getAnswerInputBoxes();
		if (!!inputs && inputs.length > 0) {
			inputs.forEach((input) => {
				input.value = '';
			});
		}
	}

	function ClearButtonClickHandle(event) {
		ClearOldValues();
		focusOnFirstIfAvailable();
	}

	function getAnswerInputBoxes() {
		if (!!document) {
			return document.getElementsByName('answerChars');
		} else {
			return null;
		}
	}

	function focusOnFirstIfAvailable() {
		const inputs = getAnswerInputBoxes();
		if (!!inputs && inputs.length > 0) {
			inputs[0].focus();
		}
	}

	function init(el) {
		if (el.id === '0') {
			el.focus();
		}
	}
</script>

<div>
	{#each currentLetters as { letter }, i}
		<input
			class="input variant-form-material"
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
			use:init
		/>
	{/each}
	<button type="button" class="btn variant-filled bg-red-500 m-2" on:click={ClearButtonClickHandle}><i class="fa fa-trash"></i></button>
</div>

<style>
	input {
		margin: 0 0.5rem;
		padding: 0.3rem;
		border: 1px solid #333;
		width: 44px;
		height: 44px;
		text-align: center;
		font-size: 1.5rem;
	}
</style>
