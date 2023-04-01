<script>
	import { onMount } from 'svelte';
	export let letters = [];

	
    // onMount(()=>{
    //     letters = word.split('');
    // });
     
	// onMount(async () => {
    //     letters = word.split('');
	// 	// data.spellingDataV2 = data;
	// 	//console.log(JSON.stringify(data.spellingDataV2));
	// 	//setComponentData(data.spellingDataV2[currentIndex]);
	// 	// focus on textbox
	// 	//  document.getElementById('spellingTextbox').focus();
	// });
</script>

<div>
	{#each letters as { letter }, i}
		<input type="text" maxlength="1" />
	{/each}
</div>

<style>
input {
  margin: 0 0.5rem;
  padding: 0.5rem;
  border: 1px solid #333;
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 3rem;
}
</style>