<script>
	import { slide } from "svelte/transition";


  let {
    children,
    func = () => {}, 
    type = "button", 
    disabled = false, 
    ariaLabel = "", 
    class: className
    } = $props()
</script>

<button 
  onclick={func}
  type={type}
  aria-label={ariaLabel}
  disabled={disabled}
  transition:slide
  class={`
    cursor-pointer shadow px-3 py-2 
    bg-soft-linen-100 dark:bg-dusk-blue-950
    border-soft-linen-300 rounded-[99999px] border dark:border-dusk-blue-800
    text-dusk-blue-800 dark:text-soft-linen-100
    hover:bg-soft-linen-200 dark:hover:bg-dusk-blue-900
    active:scale-95	
    transition-all ${className}`}> 
  {@render children?.()}
</button>