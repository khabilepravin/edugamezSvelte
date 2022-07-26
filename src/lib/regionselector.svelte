<script>
	import { createEventDispatcher } from 'svelte';
	let selectedRegion = 'en-US';

	const dispatch = createEventDispatcher();
</script>

<div class="form-check form-check-inline">
	<input
		class="form-check-input"
		type="radio"
		name="exampleRadios"
		id="enUS"
		value="en-US"
		bind:group={selectedRegion}
		on:change={() => dispatch('regionChanged', selectedRegion)}
	/>
	<label class="form-check-label" for="enUS"> en-US </label>
</div>
<div class="form-check form-check-inline">
	<input
		class="form-check-input"
		type="radio"
		name="exampleRadios"
		id="enUS"
		value="en-GB"
		bind:group={selectedRegion}
		on:change={() => dispatch('regionChanged', selectedRegion)}
	/>
	<label class="form-check-label" for="enGB"> en-GB </label>
</div>
<div class="form-check form-check-inline">
	<input
		class="form-check-input"
		type="radio"
		name="exampleRadios"
		id="enUS"
		value="en-AU"
		bind:group={selectedRegion}
		on:change={() => dispatch('regionChanged', selectedRegion)}
	/>
	<label class="form-check-label" for="enAU"> en-AU </label>
</div>

<style>
</style>
