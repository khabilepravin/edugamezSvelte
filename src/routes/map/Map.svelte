<script>
	import { GoogleCharts } from 'google-charts';
    import { onMount } from 'svelte';        

    export let selectedCountry = '';
	onMount(() => {
        GoogleCharts.load(drawGeoChart, {
			packages: ['geochart'],
			mapsApiKey: import.meta.env.VITE_ENV_mapAPIKey
		});

		function drawGeoChart() {
			/* Geo Chart */
            initilizeChartWithCountry(selectedCountry);			
		}
	});

    export const initilizeChartWithCountry = (countryToSelect) => {
        const geo_1_data = GoogleCharts.api.visualization.arrayToDataTable([['Country'], [countryToSelect]]);
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
</script>

<div id="geoChart"/>
