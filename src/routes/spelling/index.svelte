<script>
	import AudioPlayer from './AudioPlayer.svelte';
	import { goto } from '$app/navigation';
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineChevronDoubleRight from "svelte-icons-pack/hi/HiOutlineChevronDoubleRight";
	import { spellingUserAnswers } from "../../lib/store";

	export let spellingData;

	let currentIndex = 0;
	let wordAudioUrl = spellingData[currentIndex].wordAudioUrl;
	let definitonAudioUrl = spellingData[currentIndex].defintionAudioUrl;
	let exampleAudioUrl = spellingData[currentIndex].exampleAudioUrl;

	let spelledAnswer = null;
	//let results = [];

	const handleNext = () => {
		let currentWordData = spellingData[currentIndex];
		$spellingUserAnswers = [...$spellingUserAnswers, getUserAnswer(currentWordData, spelledAnswer)];

		if (currentIndex === 9) {
			goto('/spelling/result');
		} else {
			// Move to next
			currentIndex = currentIndex + 1;
			currentWordData = spellingData[currentIndex];
			wordAudioUrl = currentWordData.wordAudioUrl;
			definitonAudioUrl = currentWordData.defintionAudioUrl;
			exampleAudioUrl = currentWordData.exampleAudioUrl;
			spelledAnswer = null;
		}
	};

	const getUserAnswer = (originalWord, userAnswer) => {
		let isCorrect = originalWord.word.trim().toLowerCase() === userAnswer.trim().toLowerCase();

		return {
			actualWord: originalWord.word,
			userAnswer: userAnswer,
			isCorrect: isCorrect
		};
	};
</script>

<svelte:head>
	<title>Spelling Game</title>
</svelte:head>
<div class="text-center">
	<h6>Word</h6>

	<AudioPlayer src={wordAudioUrl} autoPlay="true"/>
	<h6>Definition</h6>
	<AudioPlayer src={definitonAudioUrl} />
	<h6>Example</h6>
	<AudioPlayer src={exampleAudioUrl} />

	<div class="container">
		<div class="row">
			<div class="col-sm">
				<input type="text" class="form-control" placeholder="Spelling" bind:value={spelledAnswer} />
			</div>
		</div>
		<div class="row">
			<div class="col-sm">
				<button
					on:click={handleNext}
					disabled={spelledAnswer === null}
					value="Next"
					class="btn btn-primary mt-3">Next
					<Icon src={HiOutlineChevronDoubleRight}/>
					 </button
				>
			</div>
		</div>
	</div>
</div>
