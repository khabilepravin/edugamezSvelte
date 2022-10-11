<script>
	import { createEventDispatcher } from 'svelte';
	import { RadioButtonGroup, RadioButton } from 'carbon-components-svelte';
	import 'carbon-components-svelte/css/white.css';

	const dispatch = createEventDispatcher();

	export let selectedRegion;

	function handleChange(event){
		dispatch('regionChanged', event.detail);
	}
</script>

<div class="d-flex flex-column justify-content-center align-items-center">
	<RadioButtonGroup
		on:change={handleChange}
		selected={selectedRegion}
	>
		<RadioButton labelText="en-US" value="en-US" />
		<RadioButton labelText="en-GB" value="en-GB" />
		<RadioButton labelText="en-AU" value="en-AU" />
	</RadioButtonGroup>
</div>


