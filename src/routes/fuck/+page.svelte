<script>
  import { onMount } from "svelte";
  let percent = $state(0);
  let li = $state([])
  $inspect(li)
  onMount( main )
  
  function main() {
    const VH = window.innerHeight;
    const VW = window.innerWidth;
    const VHC = VH/2;
    const VWC = VW/2;
    
    

    for (let i = 0; i < 360; i++) {
      let angle = toRadians(i);
      let x = VWC + Math.cos(angle) * percent * VW;
      let y = VHC + Math.sin(angle) * percent * VH;
      li.push({angle: angle, x: x, y: y});
    }
  }
  function toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

</script>
{#each li as i (i.id)}
  <div 
    class="bg-white rounded-full w-1 h-1 fixed" 
    style="left: {i.x} top: {i.y}"></div>
{/each}


<div class="fixed bottom-4 left-1/2 -translate-x-1/2 w-64">
  <div class="flex items-center gap-4">
    <input type="range" min="0" max="100" bind:value={percent} class="w-full" />
    <span class="text-sm font-medium">{percent}%</span>
  </div>
</div>