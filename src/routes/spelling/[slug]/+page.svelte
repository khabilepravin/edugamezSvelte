<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { popup, RangeSlider } from '@skeletonlabs/skeleton';

	// local imports
	import AudioPlayer from '$lib/components/audioplayer.svelte';
	import Answerinput from '$lib/components/answerinput.svelte';
	import { spellingUserAnswers } from '$lib/store/answersStore';
	import { currentPlaybackRate } from '$lib/store/playbackRateStore';
	import { getUrlByRegion } from '$lib/utils/region';
	import { arrayMove } from '$lib/utils/arr';
	import { capitalizeFirstLetter } from '$lib/utils/string';
	import { findExactDifference } from '$lib/utils/wordDifference';
	import RegionSelector from '$lib/components/regionselector.svelte';
	import { getCountryCodeByTimezone } from '$lib/utils/region';

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
	let currentRegion = getCountryCodeByTimezone();
	let currentAudioPlaybackRate = $currentPlaybackRate;
	let wordPlayFunction;

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
		definitionAndExampleFor = currentWordInstance.definitionandexamplefor;
		wordAudioUrl = getUrlByRegion(currentWordInstance.wordaudios, currentRegion);
		definitonAudioUrl = getUrlByRegion(currentWordInstance.definitionaudios, currentRegion);
		exampleAudioUrl = getUrlByRegion(currentWordInstance.exampleaudios, currentRegion);
		partsOfTheSpeech = deDuplicatePartsOfSpeechArray(currentWordInstance.partsofthespeech);
		currentWord = currentWordInstance.word;
		currentAudioPlaybackRate = $currentPlaybackRate;
	};

	const getUserAnswer = (originalWord, userAnswer) => {
		const isCorrect = originalWord.word.trim().toLowerCase() === userAnswer.trim().toLowerCase();
		const exactDifference = findExactDifference(originalWord.word, userAnswer);

		return {
			actualWord: originalWord.word,
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

	function handleWordAudioPlaying() {
		handleDefinitionResetOfAudio();
		handleExampleResetOfAudio();
	}

	function handleDefinitionAudioPlaying() {
		handleWordResetOfAudio();
		handleExampleResetOfAudio();
	}

	function handleExampleAudioPlaying() {
		handleDefinitionResetOfAudio();
		handleWordResetOfAudio();
	}

	function playbackSpeedChanged(event) {
		currentPlaybackRate.set(event.target.value);
		currentAudioPlaybackRate = $currentPlaybackRate;
		wordPlayFunction();
	}

	const popupFeatured = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupFeatured',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};
</script>

<svelte:head>
	<title>Spelling Practice Difficulty {difficultyLevel}</title>
</svelte:head>
<div class="card p-4 w-72 shadow-xl" data-popup="popupFeatured">
	<div>
		<RangeSlider
			name="range-slider"
			bind:value={$currentPlaybackRate}
			max={1.5}
			step={0.25}
			min={0.5}
			ticked
			on:change={playbackSpeedChanged}
		>
			<div class="flex justify-between items-center">
				<div class="font-bold">Playback Speed</div>
				<div class="text-xs"><strong>{$currentPlaybackRate}</strong></div>
			</div>
		</RangeSlider>
	</div>
	<!-- <div class="arrow bg-surface-100-800-token" /> -->
</div>
<form on:submit|preventDefault={handleNext}>
	<div class="text-center">
		<div class="container">
			<div class="row">
				<div class="col-sm pb-2">
					<RegionSelector on:regionChanged={handleRegionChange} />
					<button
						type="button"
						class="btn-icon btn-icon-sm variant-filled-tertiary m-2"
						use:popup={popupFeatured}><i class="fa fa-gear" /></button
					>
				</div>
			</div>
			<div class="columns-3 my-2">
				<AudioPlayer
					src={wordAudioUrl}
					autoPlay="true"
					playerText="Word"
					on:startedPlaying={handleWordAudioPlaying}
					bind:handleResetAudio={handleWordResetOfAudio}
					bind:playbackRate={currentAudioPlaybackRate}
					bind:playAudio={wordPlayFunction}
				/>
				<AudioPlayer
					src={definitonAudioUrl}
					autoPlay={null}
					playerText="Definition"
					on:startedPlaying={handleDefinitionAudioPlaying}
					bind:handleResetAudio={handleDefinitionResetOfAudio}
					bind:playbackRate={currentAudioPlaybackRate}
				/>
				<AudioPlayer
					src={exampleAudioUrl}
					autoPlay={null}
					playerText="Example"
					on:startedPlaying={handleExampleAudioPlaying}
					bind:handleResetAudio={handleExampleResetOfAudio}
					bind:playbackRate={currentAudioPlaybackRate}
				/>
			</div>
		</div>
		<div class="container">
			{#each partsOfTheSpeech as part}
				{#if part === definitionAndExampleFor}
					<span class="badge variant-filled-success my-2">{part}</span>
				{:else}
					<span class="badge my-2">{part}</span>
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
				<span class="badge variant-filled float-left ml-4 my-4 font-bold text-base"
					>{currentIndex + 1} of {maxRecordsInATest}</span
				>
				<span class="badge variant-filled-warning float-left ml-2 my-4 text-base"
					>Difficulty {difficultyLevel}</span
				>

				<button
					value="Next"
					type="submit"
					class="btn btn-lg variant-filled bg-secondary-500 float-right m-2"
					>{currentIndex + 1 == maxRecordsInATest ? 'Done' : 'Next'}
				</button>
			</div>
		</div>
	</div>
</form>
