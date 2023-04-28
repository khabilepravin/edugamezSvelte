<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// local imports
	import AudioPlayer from '$lib/components/audioPlayer.svelte';
	import Answerinput from '$lib/components/answerinput.svelte';
	import { spellingUserAnswers } from '$lib/store/answersStore';
	import { getUrlByRegion } from '$lib/utils/region';
	import { Tag } from 'carbon-components-svelte';
	import { percentage } from '$lib/utils/percent';
	import { arrayMove } from '$lib/utils/arr';
	import { capitalizeFirstLetter } from '$lib/utils/string';
	import RegionSelector from '$lib/components/regionselector.svelte';
	import 'carbon-components-svelte/css/white.css';

	// public props
	/** @type {import('./$types').PageData} */
	export let data;

	// local props
	let currentIndex = 0;
	let wordAudioUrl;
	let definitonAudioUrl;
	let exampleAudioUrl;
	let partsOfTheSpeech = [];
	let definitionAndExampleFor;
	let spelledAnswer = '';
	const maxRecordsInATest = 7;
	//let percentComplete = 0;
	let currentWord = '';
	//let timer;
	let onQuestionChange;
	let handleWordResetOfAudio;
	let handleDefinitionResetOfAudio;
	let handleExampleResetOfAudio;
	let difficultyLevel;

	let currentRegion = 'en-GB';
	// store variables
	$spellingUserAnswers = [];

	// lifecycle hooks
	onMount(async () => {
		setComponentData(data.spellingDataV2[currentIndex]);
		difficultyLevel = capitalizeFirstLetter(data.difficultyLevel);
		onQuestionChange();
	});

	// private functions
	const setComponentData = (currentWordInstance) => {
		definitionAndExampleFor = currentWordInstance.DefinitionAndExampleFor;
		wordAudioUrl = getUrlByRegion(currentWordInstance.WordAudios, currentRegion);
		definitonAudioUrl = getUrlByRegion(currentWordInstance.DefinitionAudios, currentRegion);
		exampleAudioUrl = getUrlByRegion(currentWordInstance.ExampleAudios, currentRegion);
		partsOfTheSpeech = deDuplicatePartsOfSpeechArray(currentWordInstance.PartsOfTheSpeech);
		currentWord = currentWordInstance.Word;
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
		resetAllAudioPlayers();
		percentComplete = percentage(currentIndex + 1, maxRecordsInATest);
		let currentWordData = data.spellingDataV2[currentIndex];		
		$spellingUserAnswers = [...$spellingUserAnswers, getUserAnswer(currentWordData, spelledAnswer)];

		if (currentIndex === maxRecordsInATest - 1) {
			//last one
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
		const deDuplicatedArray = inputArr.filter((value, index) => {
			return inputArr.indexOf(value) === index;
		});

		const indexOfPartOfTheSpeech = deDuplicatedArray.indexOf(definitionAndExampleFor);
		// Moving the current part of the speech at the begining
		return arrayMove(deDuplicatedArray, indexOfPartOfTheSpeech, 0); 
	}

	function resetAllAudioPlayers(){
		handleWordResetOfAudio();
		handleDefinitionResetOfAudio();
		handleExampleResetOfAudio();
	}
</script>

<svelte:head>
	<title>Spelling Practice Difficulty {difficultyLevel}</title>
</svelte:head>
<form on:submit|preventDefault={handleNext}>
	<div class="text-center">
		<div class="container">
			<div class="row">
				<div class="col-sm pb-3">
					<RegionSelector on:regionChanged={handleRegionChange} />
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
					<AudioPlayer
						src={wordAudioUrl}
						autoPlay="true"
						bind:handleResetAudio={handleWordResetOfAudio}
					/>
				</div>
				<div class="col">
					<AudioPlayer
						src={definitonAudioUrl}
						autoPlay={null}
						bind:handleResetAudio={handleDefinitionResetOfAudio}
					/>
				</div>
				<div class="col">
					<AudioPlayer
						src={exampleAudioUrl}
						autoPlay={null}
						bind:handleResetAudio={handleExampleResetOfAudio}
					/>
				</div>
			</div>
		</div>
		<div class="container">
			{#each partsOfTheSpeech as part}
				{#if part === definitionAndExampleFor}
					<Tag type="green"><strong>{part}</strong></Tag>
				{:else}
					<Tag type="green" disabled>{part}</Tag>
				{/if}
			{/each}
			<div class="row">
				<div class="col-sm">
					<Answerinput
						currentLetters={currentWord.split('')}
						bind:LettersChanged={onQuestionChange}
						bind:currentStateOfTheAnswer={spelledAnswer}
					/>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<Tag type="green" class="mt-3 float-left">{currentIndex + 1} of {maxRecordsInATest}</Tag>
					<Tag type="red" class="mt-3 float-left">Difficulty {difficultyLevel}</Tag>
				</div>
				<div class="col">
					<button value="Next" type="submit" class="btn btn-primary mt-3 float-right"
						>{currentIndex + 1 == maxRecordsInATest ? 'Done' : 'Next'}
					</button>
				</div>
			</div>
		</div>
	</div>
</form>
