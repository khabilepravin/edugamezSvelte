<script>
    import { createEventDispatcher } from 'svelte';
	export let optionsToChooseFrom = [];

    const dispatch = createEventDispatcher();
    const onOptionSelectionChanged = (e) => {        
        dispatch('optionSelected', {
			selectedOption: e.target.id
		});
    }
</script>

<div class="container">
	<div class="radio-tile-group">
		{#each optionsToChooseFrom as o, i}
			<div class="input-container">
				<input id={o.countryName} class="radio-button" type="radio" name="radio" on:input={onOptionSelectionChanged}/>
				<div class="radio-tile">					
					<label for="walk" class="radio-tile-label">{o.countryName}</label>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	* {
		box-sizing: border-box;
		font-family: 'Helvetica Neue', sans-serif;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 20vh;
	}

	.radio-tile-group {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	.radio-tile-group .input-container {
		position: relative;
		height: 7rem;
		width: 7rem;
		margin: 0.5rem;
	}
	.radio-tile-group .input-container .radio-button {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		margin: 0;
		cursor: pointer;
	}
	.radio-tile-group .input-container .radio-tile {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		border: 2px solid #079ad9;
		border-radius: 5px;
		padding: 1rem;
		transition: transform 300ms ease;
	}
	.radio-tile-group .input-container .radio-tile-label {
		text-align: center;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: #079ad9;
	}
	.radio-tile-group .input-container .radio-button:checked + .radio-tile {
		background-color: #079ad9;
		border: 2px solid #079ad9;
		color: white;
		transform: scale(1.1, 1.1);
	}

	.radio-tile-group .input-container .radio-button:checked + .radio-tile .radio-tile-label {
		color: white;
		background-color: #079ad9;
	}
</style>
