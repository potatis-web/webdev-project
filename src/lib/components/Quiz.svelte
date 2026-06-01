<script>
	import { resolve } from "$app/paths";
  import { goto } from "$app/navigation";
	import { fade } from "svelte/transition";
	import Button from "./Button.svelte";


	let { quiz, idx, selected = $bindable() } = $props();
</script>

<button
	class={`relative flex h-3/5 w-2/7 flex-col rounded-2xl shadow ring ring-soft-linen-200 dark:ring-dusk-blue-800 object-cover transition-all overflow-hidden gap-2 items-center  ${selected === idx ? 'ring-2 ring-dusk-blue-500' : ''}`}
	onclick={() => (selected = idx)}
  ondblclick={() => goto(resolve(`/quiz/${quiz.id}`))}
  transition:fade
>
	<img class="h-2/5 bg-soft-linen-200 dark:bg-dusk-blue-800 w-full " src={quiz.image} alt={quiz.name + ' Image'} />
  <div class="h-3/5 w-9/10 text-ellipsis p-4">
    <h3 class="heading">{quiz.name}</h3>
    <p class="text-ellipsis w-full">{quiz.description}</p>
    <div class="absolute bottom-4">
      <Button func={() => goto(resolve(`/play/${quiz.id}`))}>Play</Button>
    </div>
  </div>
</button>
