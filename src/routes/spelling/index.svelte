<script>
	import AudioPlayer from './AudioPlayer.svelte';
	export let spellingData;

	let currentIndex = 0;
	let wordAudioUrl = spellingData[currentIndex].wordAudioUrl;
	let definitonAudioUrl = spellingData[currentIndex].defintionAudioUrl;
	let exampleAudioUrl = spellingData[currentIndex].exampleAudioUrl;

    let spelledAnswer = null;

	const handleNext = () => {
		currentIndex = currentIndex + 1;
		wordAudioUrl = spellingData[currentIndex].wordAudioUrl;
		definitonAudioUrl = spellingData[currentIndex].defintionAudioUrl;
		exampleAudioUrl = spellingData[currentIndex].exampleAudioUrl;
        spelledAnswer = null;
	};
</script>

<svelte:head>
	<title>Spelling Game</title>
</svelte:head>
<div>
	<h5>Word</h5>

	<AudioPlayer src={wordAudioUrl} />
	<h5>Definition</h5>
	<AudioPlayer src={definitonAudioUrl} />
	<h5>Example</h5>
	<AudioPlayer src={exampleAudioUrl} />

	<div class="d-flex flex-lg-row">
		<div class="d-flex flex-lg-column">
			<input type="text" class="form-control" placeholder="Spelling" bind:value={spelledAnswer}/>
		</div>
	</div>
	<div class="d-flex flex-lg-row">
		<div class="flex-lg-column">
			<button on:click={handleNext} disabled={spelledAnswer === null} value="Next" class="btn-primary">Next</button>
		</div>
	</div>
</div>

