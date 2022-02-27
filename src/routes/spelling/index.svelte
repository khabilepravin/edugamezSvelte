<script>
	import AudioPlayer from './AudioPlayer.svelte';
    import {goto} from '$app/navigation';
    
	export let spellingData;

	let currentIndex = 0;
	let wordAudioUrl = spellingData[currentIndex].wordAudioUrl;
	let definitonAudioUrl = spellingData[currentIndex].defintionAudioUrl;
	let exampleAudioUrl = spellingData[currentIndex].exampleAudioUrl;

    let spelledAnswer = null;
    let results = [];

	const handleNext = () => {
        
        let currentWordData = spellingData[currentIndex];

        // log user answer
        results = [...results, getUserAnswer(currentWordData, spelledAnswer)];

       // console.log(results);
       currentIndex = currentIndex + 1;
       
       if(currentIndex === 9){
         goto('/spelling/result');
       }
       else{
        // Move to next        
        currentWordData = spellingData[currentIndex];
		wordAudioUrl = currentWordData.wordAudioUrl;
		definitonAudioUrl = currentWordData.defintionAudioUrl;
		exampleAudioUrl = currentWordData.exampleAudioUrl;
        spelledAnswer = null;
       }
        
	};

    const getUserAnswer = (originalWord, userAnswer) => {
        let isCorrect = originalWord.word.trim().toLowerCase() === userAnswer.trim().toLowerCase();

        return {
            actualWord: originalWord.word,
            userAnswer: userAnswer,
            isCorrect: isCorrect
        };
    };
</script>

<svelte:head>
	<title>Spelling Game</title>
</svelte:head>
<div>
	<h6>Word</h6>

	<AudioPlayer src={wordAudioUrl} />
	<h6>Definition</h6>
	<AudioPlayer src={definitonAudioUrl} />
	<h6>Example</h6>
	<AudioPlayer src={exampleAudioUrl} />

	<div class="d-flex flex-lg-row">
		<div class="d-flex flex-lg-column">
			<input type="text" class="form-control" placeholder="Spelling" bind:value={spelledAnswer}/>
		</div>
	</div>
	<div class="d-flex flex-lg-row">
		<div class="d-flex flex-lg-column">
			<button on:click={handleNext} disabled={spelledAnswer === null} value="Next" class="btn-primary">Next</button>
		</div>
	</div>
</div>

