  <script>
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition';
  
    export let src    
    export let autoPlay
    let player
  
    onMount(() => {      
      player = player;
    })
  </script>
  
  <div>
    {#if (src === null)}
    <div class="no-audio-div">
      <h6>Not available</h6>
    </div>
    {:else}    
      <audio
          bind:this={player}
          {src}
          transition:fade
          controls
          autoplay={autoPlay}>         
      </audio>
    {/if}
  </div>

  <style>
    .no-audio-div {
      height: 60px;
    }
  </style>