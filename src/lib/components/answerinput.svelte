<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	// public props
	export let currentLetters = [];
	export let currentStateOfTheAnswer = '';

	let recognition;
	let isRecording = false;
	let output = '';

	// public funcs
	export const LettersChanged = () => {
		ClearOldValues();
		focusOnFirstIfAvailable();
	};

	// life cycle hooks
	onMount(() => {
		focusOnFirstIfAvailable();

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		recognition = new SpeechRecognition();
		recognition.lang = 'en-US'; // Set the language for recognition
		recognition.continuous = true; // Keep listening even if the user pauses
		recognition.maxAlternatives = 1; // Number of alternatives to consider
		recognition.interimResults = true; // Show interim results

		recognition.onstart = () => {
			output = 'Listening...';
		};

		recognition.onresult = (event) => {
			handleResult(event);
		};

		recognition.onerror = (event) => {
			console.error('Error occurred in recognition:', event.error);
		};

		recognition.onend = () => {
			console.log('Recognition ended');
		};
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

	const texts = {};
	const spokenLetters = [];
	function handleResult(message) {
		texts[message.resultIndex] = message.results[message.results.length - 1][0].transcript;
		const keys = Object.keys(texts);
		keys.sort((a, b) => a - b);
		for (const key of keys) {
			if (texts[key]) {		
				spokenLetters.push(texts[key]);
			}
		}

		console.log(spokenLetters);
		// when the output length is equal to the number of input boxes
		if(spokenLetters.length == getAnswerInputBoxes().length){
			// construct the answer
			//currentLetters = msg.tocharArray();
		}
			
	}

	function toggleListening() {
		if (recognition) {
			if (isRecording) {
				recognition.stop();
				isRecording = false;
			} else {
				recognition.start();
				isRecording = true;
			}
		}
	}
</script>

<div>
	{#each currentLetters as { letter }, i}
		<input
			class="input variant-form-material m-1 text-xl font-semibold"
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
	<button
		type="button"
		class="btn variant-filled bg-green-500 m-2"
		on:click={toggleListening}><i class="fa-solid fa-microphone" /></button
	>
	<button type="button" class="btn variant-filled bg-red-500 m-2" on:click={ClearButtonClickHandle}
		><i class="fa fa-trash" /></button
	>
</div>

<style>
	input {
		width: 44px;
		height: 44px;
		text-align: center;
	}
</style>
