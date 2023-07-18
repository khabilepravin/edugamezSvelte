<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// local imports
	import AudioPlayer from '$lib/Components/audioPlayer.svelte';
	import Answerinput from '$lib/Components/answerinput.svelte';
	import { spellingUserAnswers } from '$lib/Store/answersStore';
	import { getUrlByRegion } from '$lib/Utils/region';
	import { arrayMove } from '$lib/Utils/arr';
	import { capitalizeFirstLetter } from '$lib/Utils/string';
	import { findExactDifference } from '$lib/Utils/wordDifference';
	import RegionSelector from '$lib/Components/regionselector.svelte';
	import { Stepper, Step } from '@skeletonlabs/skeleton';

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
	let currentWord = '';
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
		const isCorrect = originalWord.Word.trim().toLowerCase() === userAnswer.trim().toLowerCase();
		const exactDifference = findExactDifference(originalWord.Word, userAnswer);

		return {
			actualWord: originalWord.Word,
			userAnswer: userAnswer,
			isCorrect: isCorrect,
			exactDifference: exactDifference,
			wordAudioUrl,
			definitonAudioUrl,
			exampleAudioUrl
		};
	};

	// Event handlers
	const handleNext = () => {
		resetAllAudioPlayers();
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

	function resetAllAudioPlayers() {
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
			<div class="columns-3">
				<AudioPlayer
					src={wordAudioUrl}
					autoPlay="true"
					playerText="Word"
					bind:handleResetAudio={handleWordResetOfAudio}
				/>
				<AudioPlayer
					src={definitonAudioUrl}
					autoPlay={null}
					playerText="Definition"
					bind:handleResetAudio={handleDefinitionResetOfAudio}
				/>
				<AudioPlayer
					src={exampleAudioUrl}
					autoPlay={null}
					playerText="Example"
					bind:handleResetAudio={handleExampleResetOfAudio}
				/>
			</div>
		</div>
		<div class="container">
			{#each partsOfTheSpeech as part}
				{#if part === definitionAndExampleFor}
					<span class="badge variant-filled">{part}</span>
				{:else}
					<span class="badge">{part}</span>
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
			<div class="flow-root">
				<span class="badge variant-filled float-left m-3"
					><strong>{currentIndex + 1} of {maxRecordsInATest}</strong></span
				>
				<span class="badge variant-filled float-left m-3">Difficulty {difficultyLevel}</span>

				<button
					value="Next"
					type="submit"
					class="btn btn-sm variant-filled bg-secondary-500 float-right m-3"
					>{currentIndex + 1 == maxRecordsInATest ? 'Done' : 'Next'}
				</button>
			</div>
		</div>
	</div>
</form>
