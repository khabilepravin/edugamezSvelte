<script>
	import { GoogleCharts } from 'google-charts';
    import { onMount } from 'svelte';
    import { GetRandomCountries } from './data';
    import { fade } from 'svelte/transition';


	onMount(() => {

        //debugger;
        let singleCountry = GetRandomCountries(1);
		GoogleCharts.load(drawGeoChart, {
			packages: ['geochart'],
			mapsApiKey: import.meta.env.VITE_ENV_mapAPIKey
		});

		function drawGeoChart() {
			/* Geo Chart */
			const geo_1_data = GoogleCharts.api.visualization.arrayToDataTable([['Country'], [singleCountry[0].countryName]]);
			const geo_1_options = {
				domain: 'IN',
				defaultColor: '#0000FF',
				enableRegionInteractivity: false
			};
			const geoChart = new GoogleCharts.api.visualization.GeoChart(
				document.getElementById('geoChart')
			);
			geoChart.draw(geo_1_data, geo_1_options);
		}
	});
</script>

<div id="geoChart" transition:fade/>
