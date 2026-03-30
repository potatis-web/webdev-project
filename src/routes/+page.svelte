<script>
  import { onMount } from "svelte";
  let userData = $state({});
  const userTemplate = {
      ql: [
        {
          name: "Cheese Quiz",
          description: "Test your cheese knowledge",
          image: "https://www.schultzscheese.com/wp-content/uploads/2015/06/swiss.jpg",
          q: [
            {
              title: "Is cheese good?",
              options: [
                { text: "Yes, absolutely!", value: "yes" },
                { text: "No, not really", value: "no" },
                { text: "It depends on the type", value: "maybe" }
              ]
            },
            {
              title: "What's your favorite cheese?",
              options: [
                { text: "Cheddar", value: "cheddar" },
                { text: "Mozzarella", value: "mozzarella" },
                { text: "Brie", value: "brie" },
                { text: "Blue cheese", value: "blue" }
              ]
            }
          ]
        }
      ]
    };
  onMount(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      localStorage.setItem("user",JSON.stringify(userTemplate));
      userData = userTemplate;
    } else {
      userData = JSON.parse(storedUser)
    }
  })

</script>

<main>
  {#if userData.ql}
    {#each userData.ql as quiz (quiz.id)}
      <div class="bg-amber-300 p-8">{quiz.name}</div>
    {/each}
  {/if}
</main>
<style>
  :global(body) {
    background-color: var(--color-gray-800);
  }
</style>