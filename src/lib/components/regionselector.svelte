<script>
	import { createEventDispatcher } from 'svelte';
	import { ContentSwitcher, Switch } from 'carbon-components-svelte';
	import { getCountryCodeByTimezone } from '$lib/utils/region';
	import 'carbon-components-svelte/css/white.css';
	import '/node_modules/flag-icons/css/flag-icons.min.css';

	const dispatch = createEventDispatcher();

	let selectedIndex = returnDefaultIndex();

	function returnDefaultIndex() {
		const currentRegion = getCountryCodeByTimezone();
		if (currentRegion === 'en-AU') {
			return 2;
		}

		if (currentRegion === 'en-GB') {
			return 1;
		}

		if (currentRegion === 'en-US') {
			return 0;
		}
	}

	function handleRegionChange(event) {
		if (event.detail === 0) {
			dispatch('regionChanged', 'en-US');
		}

		if (event.detail === 1) {
			dispatch('regionChanged', 'en-GB');
		}
		if (event.detail === 2) {
			dispatch('regionChanged', 'en-AU');
		}
	}
</script>

<div class="d-flex flex-column justify-content-center align-items-center">
	<ContentSwitcher on:change={handleRegionChange} bind:selectedIndex>
		<Switch>
			<div style="display: flex; align-items: center;">
				<span class="fi fi-us" title="American Pronunciation" />&nbsp; US
			</div>
		</Switch>
		<Switch>
			<div style="display: flex; align-items: center;">
				<span class="fi fi-gb" alt="British Pronunciation" />&nbsp; GB
			</div>
		</Switch>
		<Switch>
			<div style="display: flex; align-items: center;">
				<span class="fi fi-au" title="Australian Pronunciation"/>&nbsp; AU
			</div>
		</Switch>
	</ContentSwitcher>
</div>
