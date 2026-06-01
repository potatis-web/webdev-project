<script>
  import InputText from "./InputText.svelte";

  let {required = false, text, value = $bindable(), preset = "", placeholder = text} = $props();
  
  

  const number = Math
    .random()
    .toString()
    .slice(2);
  let id = text + number;

  switch (preset) {
    case "email":
      text = "E-Mail";
      placeholder = "example@email.com";
      break;
    case "password":
      text = "Password";
      placeholder = "●●●●●●●●";
      break;
  }
</script>
<div class="flex items-center justify-between">
  <label for={id} class={`${required ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ""}`}>{text}</label>
  <InputText id={id} bind:value={value} placeholder={placeholder} type={preset}/>
</div>
