<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineChevronDoubleRight from 'svelte-icons-pack/hi/HiOutlineChevronDoubleRight';

	// local imports
	import AudioPlayer from './AudioPlayer.svelte';
	import { spellingUserAnswers } from '../../lib/store';
	import { getUrlByRegion } from './utility';
	import Progress from '$lib/progress.svelte';
	import { percentage } from '$lib/percent';
	import RegionSelector from '$lib/regionselector.svelte';

	// public props
	export let spellingDataV2;

	// local props
	let currentRegion = 'en-AU';
	let currentIndex = 0;
	let wordAudioUrl;
	let definitonAudioUrl;
	let exampleAudioUrl;
	let spelledAnswer = null;
	$spellingUserAnswers = [];
	const maxRecordsInATest = 10;
	let percentComplete = 0;
	let timer;

	// lifecycle hooks
	onMount(async () => {
		console.log(spellingDataV2[currentIndex]);
		setComponentData(spellingDataV2[currentIndex]);
	});

	// private functions
	const setComponentData = (currentWordInstance) => {
		wordAudioUrl = getUrlByRegion(currentWordInstance.WordAudios, currentRegion);
		definitonAudioUrl = getUrlByRegion(currentWordInstance.DefinitionAudios, currentRegion);
		exampleAudioUrl = getUrlByRegion(currentWordInstance.ExampleAudios, currentRegion);
	};

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
			spelledAnswer = null;
		}
	};

	const getUserAnswer = (originalWord, userAnswer) => {
		let isCorrect = originalWord.Word.trim().toLowerCase() === userAnswer.trim().toLowerCase();

		return {
			actualWord: originalWord.Word,
			userAnswer: userAnswer,
			isCorrect: isCorrect
		};
	};

	const debounce = (v) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			spelledAnswer = v;
		}, 750);
	};

	const handleRegionChange = (event) => {
		currentRegion = event.detail;
		setComponentData(spellingDataV2[currentIndex]);
	};
</script>

<svelte:head>
	<title>Spelling Game</title>
</svelte:head>
<!-- <header>
	<Icon src={BsPenFill} size="28" />
</header> -->
<!-- <main> -->
	<div class="text-center">
		<div class="container">
			<div class="row">
				<div class="col-sm">
					<RegionSelector on:regionChanged={handleRegionChange} selectedRegion={currentRegion} />
				</div>
			</div>
		</div>
		<h6>Word</h6>

		<AudioPlayer src={wordAudioUrl} autoPlay="true" />
		<h6>Definition</h6>
		<AudioPlayer src={definitonAudioUrl} />
		<h6>Example</h6>
		<AudioPlayer src={exampleAudioUrl} />

		<div class="container">
			<div class="row">
				<div class="col-sm">
					<input
						type="text"
						class="form-control"
						placeholder="Spelling"
						spellcheck="false"
						on:keyup={({ target: { value } }) => debounce(value)}
						bind:value={spelledAnswer}
					/>
				</div>
			</div>
			<Progress
				currentProgress={percentComplete}
				currentItemNumber={currentIndex + 1}
				totalItems={maxRecordsInATest}
			/>
			<div class="row">
				<div class="col-sm">
					<button
						on:click={handleNext}
						disabled={spelledAnswer === null}
						value="Next"
						class="btn btn-primary mt-3"
						>Next
						<Icon src={HiOutlineChevronDoubleRight} />
					</button>
				</div>
			</div>
		</div>
	</div>
<!-- </main> -->
