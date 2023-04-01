<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// local imports
	import AudioPlayer from '$lib/components/audioPlayer.svelte';
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
	let timer;

	let currentRegion = 'en-US';
	// store variables
	$spellingUserAnswers = [];

	// lifecycle hooks
	onMount(async () => {

       // data.spellingDataV2 = data;
        console.log(JSON.stringify(data.spellingDataV2));
		setComponentData(data.spellingDataV2[currentIndex]);
		// focus on textbox
		document.getElementById('spellingTextbox').focus();
	});

	// private functions
	const setComponentData = (currentWordInstance) => {
		wordAudioUrl = getUrlByRegion(currentWordInstance.WordAudios, currentRegion);
		definitonAudioUrl = getUrlByRegion(currentWordInstance.DefinitionAudios, currentRegion);
		exampleAudioUrl = getUrlByRegion(currentWordInstance.ExampleAudios, currentRegion);
		partsOfTheSpeech = deDuplicatePartsOfSpeechArray(currentWordInstance.PartsOfTheSpeech);
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
			document.getElementById('spellingTextbox').focus();
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
						id="spellingTextbox"
						type="text"
						class="form-control"
						placeholder="Spelling"
						spellcheck="false"
						autocomplete="new-password"
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