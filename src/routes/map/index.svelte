<script>
	import { GetRandomCountries } from './data';
	import { shuffle } from '../../lib/random';
	import Map from './Map.svelte';
	import Options from './Options.svelte';

    let optionsChild;
    let reloadMapChart;
	let randomCountries = GetRandomCountries(10);
	let currentIndex = 0;

	let optionsToChooseFrom = [];
    let countryOptionsForAnswerSelection = null;
    
    const loadOptionsToChooseFrom = () => {
        optionsToChooseFrom = [];
        optionsToChooseFrom = [randomCountries[currentIndex]];
        countryOptionsForAnswerSelection = GetRandomCountries(100);

        // remove the current country so that it doesn't appear twice in the list
        countryOptionsForAnswerSelection = countryOptionsForAnswerSelection.filter(country => country.countryName !== randomCountries[currentIndex].countryName);

        for (let i = 0; i < 3; i++) {
            optionsToChooseFrom.push(countryOptionsForAnswerSelection[i]);		
        }

        optionsToChooseFrom = shuffle(optionsToChooseFrom);
    };	

    loadOptionsToChooseFrom();

	let currentlySelectedCountryName = randomCountries[currentIndex].countryName;

    const answerSelected = (e) => {
        console.log(e.detail);
        currentIndex++;
        currentlySelectedCountryName = randomCountries[currentIndex].countryName;
        reloadMapChart(currentlySelectedCountryName);
        loadOptionsToChooseFrom();
        optionsChild.resetOptionSelection();
    }
</script>

<svelte:head>
	<title>Map Game</title>
</svelte:head>
<div class="container">
	<div class="row">
		<div class="col-sm">
			<Map selectedCountry={currentlySelectedCountryName} bind:initilizeChartWithCountry={reloadMapChart} />
		</div>
	</div>
	<div class="row">
		<div class="col-sm mt-3">
			<Options {optionsToChooseFrom} on:optionSelected={answerSelected} bind:this={optionsChild}/>
		</div>
	</div>
</div>
