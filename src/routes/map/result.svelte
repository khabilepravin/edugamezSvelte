<script>
	import { mapUserAnswers } from '../../lib/store';
	import { GoogleCharts } from 'google-charts';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let selectedCountry = '';
	onMount(() => {
		GoogleCharts.load(drawGeoChart, {
			packages: ['geochart'],
			mapsApiKey: import.meta.env.VITE_ENV_mapAPIKey
		});

		function drawGeoChart() {
			/* Geo Chart */
			const chartData = [['Country', 'Guessed']];

			$mapUserAnswers.map((r) => chartData.push([r.actualCountry, r.isCorrect ? 1 : 0]));

			initilizeChartWithCountry(selectedCountry, chartData);
		}
	});

	export const initilizeChartWithCountry = (countryToSelect, chartData) => {
		const geo_1_data = GoogleCharts.api.visualization.arrayToDataTable(chartData);
		const geo_1_options = {
			domain: 'IN',
			defaultColor: '#0000FF',
			colorAxis: { colors: ['red', 'green'] },
			enableRegionInteractivity: true,
			tooltip: {
				textStyle: {
					fontSize: 18,
					bold: true
				}
			}
		};
		const geoChart = new GoogleCharts.api.visualization.GeoChart(
			document.getElementById('resultMap')
		);
		geoChart.draw(geo_1_data, geo_1_options);
	};
	console.log($mapUserAnswers);
</script>
<header>
	<div class="container text-center" transition:fade>
		<div class="row row-cols-1 pb-3">
			<div class="col"><h5>Results</h5></div>
		</div>
	</div>
</header>
<main>
	<div id="resultMap" />
</main>
