  <script>
    import { onMount } from 'svelte'
  
    export let src    
    export let autoPlay
    let player
  
    onMount(() => {      
      player = player;
    })
  </script>
  
  <div>
    {#if (src === null)}
      <h6>Not available</h6>
    {:else}    
      <audio
          bind:this={player}
          {src}
          controls
          autoplay={autoPlay}>
          <!-- <track kind="captions" /> -->
      </audio>
    {/if}
  </div>