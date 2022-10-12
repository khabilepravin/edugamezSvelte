<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// local imports
	import AudioPlayer from './AudioPlayer.svelte';
	import { spellingUserAnswers } from '../../lib/store';
	import { getUrlByRegion } from './utility';
	import Progress from '$lib/progress.svelte';
	import { Tag } from 'carbon-components-svelte';
	import { percentage } from '$lib/percent';
	import RegionSelector from '$lib/regionselector.svelte';
	import 'carbon-components-svelte/css/white.css';

	// public props
	export let spellingDataV2;

	// local props
	let currentRegion = 'en-AU'; //TODO: Interpret this from the browser locale
	let currentIndex = 0;
	let wordAudioUrl;
	let definitonAudioUrl;
	let exampleAudioUrl;
	let partsOfTheSpeech = [];
	let definitionAndExampleFor;
	let spelledAnswer = '';
	const maxRecordsInATest = 10;
	let percentComplete = 0;
	let timer;

	// store variables
	$spellingUserAnswers = [];

	// lifecycle hooks
	onMount(async () => {
		setComponentData(spellingDataV2[currentIndex]);
	});

	// private functions
	const setComponentData = (currentWordInstance) => {
		wordAudioUrl = getUrlByRegion(currentWordInstance.WordAudios, currentRegion);
		definitonAudioUrl = getUrlByRegion(currentWordInstance.DefinitionAudios, currentRegion);
		exampleAudioUrl = getUrlByRegion(currentWordInstance.ExampleAudios, currentRegion);
		partsOfTheSpeech = currentWordInstance.PartsOfTheSpeech;
		definitionAndExampleFor = currentWordInstance.DefinitionAndExampleFor;
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
		let currentWordData = spellingDataV2[currentIndex];

		$spellingUserAnswers = [...$spellingUserAnswers, getUserAnswer(currentWordData, spelledAnswer)];

		if (currentIndex === 9) {
			goto('/spelling/result');
		} else {
			// Move to next
			currentIndex = currentIndex + 1;
			currentWordData = spellingDataV2[currentIndex];
			setComponentData(currentWordData);
			spelledAnswer = '';
		}
	};

	const handleRegionChange = (event) => {
		currentRegion = event.detail;
		setComponentData(spellingDataV2[currentIndex]);
	};
</script>

<svelte:head>
	<title >Spelling Game</title>
</svelte:head>
<form on:submit|preventDefault={handleNext}>
	<div class="text-center">
		<div class="container">
			<div class="row">
				<div class="col-sm pb-3">
					<img src="../images/spelling-icon.webp" class="iconImageSize" alt="Spelling icon" />
					<h6>Spelling Game</h6>
				</div>
			</div>
			<div class="row">
				<div class="col-sm pb-3">
					<RegionSelector on:regionChanged={handleRegionChange} selectedRegion={currentRegion} />
				</div>
			</div>
			<div class="row">
				<div class="col-sm">
					<h6>Word</h6>
				</div>
			</div>

			<div class="row">
				<div class="col-sm">
					<AudioPlayer src={wordAudioUrl} autoPlay="true" />
				</div>
			</div>
			<div class="row">
				<div class="col-sm">
					<h6>Definition</h6>
				</div>
			</div>
			<div class="row">
				<div class="col-sm">
					<AudioPlayer src={definitonAudioUrl} autoPlay={null} />
				</div>
			</div>
			<div class="row">
				<div class="col-sm">
					<h6>Example</h6>
				</div>
			</div>
			<div class="row">
				<div class="col-sm">
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
					<input
						type="text"
						class="form-control"
						placeholder="Spelling"
						spellcheck="false"
						autocomplete="off"
						autocorrect="off"
						autocapitalize="none"
						bind:value={spelledAnswer}
					/>
				</div>
			</div>
			<Progress
				currentProgress={percentComplete}
				currentItemNumber={currentIndex + 1}
				totalItems={maxRecordsInATest}
			/>
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
