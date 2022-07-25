<script>
	import AudioPlayer from './AudioPlayer.svelte';
	import { goto } from '$app/navigation';
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineChevronDoubleRight from 'svelte-icons-pack/hi/HiOutlineChevronDoubleRight';
	import BsPenFill from 'svelte-icons-pack/bs/BsPenFill';
	import { spellingUserAnswers } from '../../lib/store';
	import { getUrlByRegion } from './utility';
	import Progress from '$lib/progress.svelte';
	import { percentage } from '$lib/percent';

	//export let spellingData;
	export let spellingDataV2;

	const currentRegion = 'en-GB';

	let currentIndex = 0;
	let wordAudioUrlv2 = getUrlByRegion(spellingDataV2[currentIndex].WordAudios, currentRegion);
	let definitonAudioUrlv2 = getUrlByRegion(
		spellingDataV2[currentIndex].DefinitionAudios,
		currentRegion
	);
	let exampleAudioUrlv2 = getUrlByRegion(spellingDataV2[currentIndex].ExampleAudios, currentRegion);

	let wordAudioUrl = wordAudioUrlv2;
	let definitonAudioUrl = definitonAudioUrlv2;
	let exampleAudioUrl = exampleAudioUrlv2;

	// let wordAudioUrl = spellingData[currentIndex].wordAudioUrl;
	// let definitonAudioUrl = spellingData[currentIndex].defintionAudioUrl;
	// let exampleAudioUrl = spellingData[currentIndex].exampleAudioUrl;

	let spelledAnswer = null;
	$spellingUserAnswers = [];
	const maxRecordsInATest = 10;
	let percentComplete = 0;
	let timer;

	const handleNext = () => {
		percentComplete = percentage(currentIndex + 1, maxRecordsInATest);
		//		let currentWordData = spellingData[currentIndex];
		let currentWordData = spellingDataV2[currentIndex];

		$spellingUserAnswers = [...$spellingUserAnswers, getUserAnswer(currentWordData, spelledAnswer)];

		if (currentIndex === 9) {
			goto('/spelling/result');
		} else {
			// Move to next
			currentIndex = currentIndex + 1;
			currentWordData = spellingDataV2[currentIndex];
			wordAudioUrl = getUrlByRegion(currentWordData.WordAudios, currentRegion);
			definitonAudioUrl = getUrlByRegion(currentWordData.DefinitionAudios, currentRegion);
			exampleAudioUrl = getUrlByRegion(currentWordData.ExampleAudios, currentRegion);
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
</script>

<svelte:head>
	<title>Spelling Game</title>
</svelte:head>
<!-- <header>
	<Icon src={BsPenFill} size="28" />
</header> -->
<main>
	<div class="text-center">
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
</main>
