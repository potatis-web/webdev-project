<script>
  let {value = $bindable(), placeholder ="Input", required = false, id, type = "text"} = $props()
</script>
{#if type == "textfield"}
  <textarea
  class="resize-none bg-soft-linen-50 dark:bg-dusk-blue-800 border-2 border-soft-linen-300 dark:border-dusk-blue-700 focus:border-dusk-blue-600 focus:outline-none focus:ring-2 focus:ring-dusk-blue-100 placeholder:text-dusk-blue-600 dark:placeholder:text-soft-linen-100/50 px-4 py-3 rounded-lg text-dusk-blue-900 dark:text-soft-linen-100 transition w-7/12"
  rows="3"></textarea>
{:else}
  <input 
    bind:value={value}
    placeholder={placeholder}
    required={required}
    id={id}
    type={type}
    class="
      bg-soft-linen-50 dark:bg-dusk-blue-800 border-2 border-soft-linen-300 dark:border-dusk-blue-700 focus:border-dusk-blue-600 focus:outline-none focus:ring-2 focus:ring-dusk-blue-100 placeholder:text-dusk-blue-600 dark:placeholder:text-soft-linen-100/50 px-4 py-3 rounded-lg text-dusk-blue-900 dark:text-soft-linen-100 transition w-7/12">
{/if}
