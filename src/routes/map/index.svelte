<script>
	import { goto } from '$app/navigation';
	import { GetRandomCountries } from './data';
	import { shuffle } from '../../lib/random';
	import Map from './Map.svelte';
	import Options from './Options.svelte';
	import { mapUserAnswers } from '../../lib/store';
	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';
	import Progress from '$lib/progress.svelte';
	import { percentage } from '$lib/percent';

	let optionsChild;
	let reloadMapChart;
	let maxRecordsInATest = 10;
	let randomCountries = GetRandomCountries(maxRecordsInATest);
	let currentIndex = 0;
	let percentComplete = 0;

	let optionsToChooseFrom = [];
	let countryOptionsForAnswerSelection = null;
	$mapUserAnswers = [];

	const loadOptionsToChooseFrom = () => {
		optionsToChooseFrom = [];
		optionsToChooseFrom = [randomCountries[currentIndex]];
		countryOptionsForAnswerSelection = GetRandomCountries(100);

		// remove the current country so that it doesn't appear twice in the list
		countryOptionsForAnswerSelection = countryOptionsForAnswerSelection.filter(
			(country) => country.countryName !== randomCountries[currentIndex].countryName
		);

		for (let i = 0; i < 3; i++) {
			optionsToChooseFrom.push(countryOptionsForAnswerSelection[i]);
		}

		optionsToChooseFrom = shuffle(optionsToChooseFrom);
	};

	loadOptionsToChooseFrom();

	let currentlyShownCountryName = randomCountries[currentIndex].countryName;

	const answerSelected = (e) => {
		let answerRecord = getAnswerRecord(e.detail.selectedOption);
		$mapUserAnswers = [...$mapUserAnswers, answerRecord];
		moveToNext();
	};

	const getAnswerRecord = (selectedAnswer) => {
		let isCorrect =
			selectedAnswer.trim().toLowerCase() === currentlyShownCountryName.trim().toLowerCase();

		return {
			actualCountry: currentlyShownCountryName,
			userAnswer: selectedAnswer,
			isCorrect: isCorrect
		};
	};

	const moveToNext = () => {
		percentComplete = percentage(currentIndex + 1, maxRecordsInATest);
		if (currentIndex === 9) {
			goto('/map/result');
		} else {
			currentIndex++;
			currentlyShownCountryName = randomCountries[currentIndex].countryName;
			reloadMapChart(currentlyShownCountryName);
			loadOptionsToChooseFrom();
			optionsChild.resetOptionSelection();
		}
	};
</script>

<svelte:head>
	<title>Map Game</title>
</svelte:head>

<div class="container">
	<div class="row">
		<div class="col-sm">
			<Map
				selectedCountry={currentlyShownCountryName}
				bind:initilizeChartWithCountry={reloadMapChart}
			/>
		</div>
	</div>
	<Progress
		currentProgress={percentComplete}
		currentItemNumber={currentIndex + 1}
		totalItems={maxRecordsInATest}
	/>
	<Options {optionsToChooseFrom} on:optionSelected={answerSelected} bind:this={optionsChild} />
</div>
