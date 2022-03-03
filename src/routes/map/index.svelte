<script>
    import { GoogleCharts } from "google-charts";

    GoogleCharts.load(drawGeoChart, 
    {    
        "packages": ['geochart'],
    "mapsApiKey": import.meta.env.VITE_ENV_mapAPIKey
    });

    function drawGeoChart() {
 
 /* Geo Chart */
 const geo_1_data = GoogleCharts.api.visualization.arrayToDataTable([
     ['State', 'Spend'],
     ['ID', {v:120000, f: '$120,000'}],
     ['CO', {v:567135, f: '$567,135'}],
     ['FL', {v:220000, f: '$220,000'}],
     ['NY', {v:1120000, f: '$1,120,000'}],
     ['CA', {v:5120000, f: '$5,120,000'}],
     ['AK', {v:101000, f: '$101,000'}],
     ['AZ', {v:311030, f: '$311,030'}]
 ]);
 const geo_1_options = {
     region: 'US',
     resolution: 'provinces',
     is3D: true,
     legend: {
         numberFormat:'$###,###'
     }
 }
 const geo_1_chart = new GoogleCharts.api.visualization.GeoChart(document.getElementById('geo_1_chart'));
 geo_1_chart.draw(geo_1_data, geo_1_options);
}
</script>

<div id="geo_1_chart"></div>