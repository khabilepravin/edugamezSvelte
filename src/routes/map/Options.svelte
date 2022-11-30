<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { RadioButtonGroup, RadioButton } from 'carbon-components-svelte';
	import "carbon-components-svelte/css/white.css"; 
	export let optionsToChooseFrom = [];

	let selected = null;

	const dispatch = createEventDispatcher();
	const onOptionSelectionChanged = (e) => {				
		dispatch('optionSelected', {
			selectedOption: e.detail
		});
	};

	export function resetOptionSelection() {
		document.activeElement.blur();		
		Array.from( document.querySelectorAll('input[type="radio"]:checked'), input => input.checked = false );
		selected = null;
	}
</script>

<div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">
<RadioButtonGroup on:change={onOptionSelectionChanged} selected
orientation="vertical">
	{#each optionsToChooseFrom as o}
		<RadioButton labelText={o.countryName} value={o.countryName}/>			
	{/each}
</RadioButtonGroup>
</div>