<script>
	import { createEventDispatcher } from 'svelte';	
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { getCountryCodeByTimezone } from '$lib/utils/region';	

	const dispatch = createEventDispatcher();

	let selectedIndex = $state(returnDefaultIndex());

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

	function handleRegionChange() {
		if (selectedIndex === 0) {
			dispatch('regionChanged', 'en-US');
		}

		if (selectedIndex === 1) {
			dispatch('regionChanged', 'en-GB');
		}
		if (selectedIndex === 2) {
			dispatch('regionChanged', 'en-AU');
		}
	}
</script>

<div class="d-flex flex-column justify-content-center align-items-center">
	<RadioGroup>
		<RadioItem bind:group={selectedIndex} name="justify" value={0} on:change={handleRegionChange}> <span class="fi fi-us m-1"></span>
			USA</RadioItem>
		<RadioItem bind:group={selectedIndex} name="justify" value={1} on:change={handleRegionChange}><span class="fi fi-gb-eng m-1"></span>ENG</RadioItem>
		<RadioItem bind:group={selectedIndex} name="justify" value={2} on:change={handleRegionChange}><span class="fi fi-au m-1"></span>AUS</RadioItem>
	</RadioGroup>	
</div>
