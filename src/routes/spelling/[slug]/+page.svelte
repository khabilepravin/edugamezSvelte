<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// local imports
	import AudioPlayer from '$lib/components/audioPlayer.svelte';
	import Answerinput from '$lib/components/answerinput.svelte';
	import { spellingUserAnswers } from '$lib/store/answersStore';
	import { getCountryCodeByTimezone, getUrlByRegion } from '$lib/utils/region';
	import Progress from '$lib/components/progress.svelte';
	import { Tag } from 'carbon-components-svelte';
	import { percentage } from '$lib/utils/percent';
	import RegionSelector from '$lib/components/regionselector.svelte';
	import 'carbon-components-svelte/css/white.css';

	// public props
	/** @type {import('./$types').PageData} */
	export let data;
	//let data.spellingDataV2;

	// local props
	let currentIndex = 0;
	let wordAudioUrl;
	let definitonAudioUrl;
	let exampleAudioUrl;
	let partsOfTheSpeech = [];
	let definitionAndExampleFor;
	let spelledAnswer = '';
	const maxRecordsInATest = 10;
	let percentComplete = 0;
	let currentWord = '';
	let timer;
	let onQuestionChange;

	let currentRegion = 'en-US';
	// store variables
	$spellingUserAnswers = [];

	// lifecycle hooks
	onMount(async () => {
		setComponentData(data.spellingDataV2[currentIndex]);
	});

	// private functions
	const setComponentData = (currentWordInstance) => {
		wordAudioUrl = getUrlByRegion(currentWordInstance.WordAudios, currentRegion);
		definitonAudioUrl = getUrlByRegion(currentWordInstance.DefinitionAudios, currentRegion);
		exampleAudioUrl = getUrlByRegion(currentWordInstance.ExampleAudios, currentRegion);
		partsOfTheSpeech = deDuplicatePartsOfSpeechArray(currentWordInstance.PartsOfTheSpeech);
		currentWord = currentWordInstance.Word;
		definitionAndExampleFor = currentWordInstance.DefinitionAndExampleFor;
		currentRegion = getCountryCodeByTimezone();
	};

	const getUserAnswer = (originalWord, userAnswer) => {
		let isCorrect = originalWord.Word.trim().toLowerCase() === userAnswer.trim().toLowerCase();

		return {
			actualWord: originalWord.Word,
			userAnswer: userAnswer,
			isCorrect: isCorrect
		};
	};

	// Event handlers
	const handleNext = () => {
		percentComplete = percentage(currentIndex + 1, maxRecordsInATest);
		let currentWordData = data.spellingDataV2[currentIndex];

		$spellingUserAnswers = [...$spellingUserAnswers, getUserAnswer(currentWordData, spelledAnswer)];

		if (currentIndex === 9) {
			goto('/spelling/result');
		} else {
			// Move to next
			currentIndex = currentIndex + 1;
			currentWordData = data.spellingDataV2[currentIndex];
			setComponentData(currentWordData);
			spelledAnswer = '';
			onQuestionChange();
		}
	};

	const handleRegionChange = (event) => {
		currentRegion = event.detail;
		setComponentData(data.spellingDataV2[currentIndex]);
	};

	function deDuplicatePartsOfSpeechArray(inputArr) {
		return inputArr.filter((value, index) => {
			return inputArr.indexOf(value) === index;
		});
	}

	function handleAnswered(event) {
		spelledAnswer = event.detail.enteredAnswer;
	}
</script>

<svelte:head>
	<title>Spelling Practice</title>
</svelte:head>
<form on:submit|preventDefault={handleNext}>
	<div class="text-center">
		<div class="container">
			<div class="row">
				<div class="col-sm pb-3">
					<RegionSelector on:regionChanged={handleRegionChange} selectedRegion={currentRegion} />
				</div>
			</div>
			<div class="row">
				<div class="col">
					<h6>Word</h6>
				</div>
				<div class="col">
					<h6>Definition</h6>
				</div>
				<div class="col">
					<h6>Example</h6>
				</div>
			</div>

			<div class="row">
				<div class="col">
					<AudioPlayer src={wordAudioUrl} autoPlay="true" />
				</div>
				<div class="col">
					<AudioPlayer src={definitonAudioUrl} autoPlay={null} />
				</div>
				<div class="col">
					<AudioPlayer src={exampleAudioUrl} autoPlay={null} />
				</div>
			</div>		
		</div>
		<div class="container">
			{#each partsOfTheSpeech as part}
				{#if part === definitionAndExampleFor}
					<Tag type="green">{part}</Tag>
				{:else}
					<Tag type="outline">{part}</Tag>
				{/if}
			{/each}
			<div class="row">
				<div class="col-sm">
					<Answerinput
						currentLetters={currentWord.split('')}
						on:answered={handleAnswered}
						bind:LettersChanged={onQuestionChange}
					/>
				</div>
			</div>		
		</div>
	</div>
	<button value="Next" type="submit" class="btn btn-primary mt-3 float">Next </button>
</form>

<style>
	.float {
		position: fixed;
		bottom: 40px;
		right: 40px;
	}
</style>
