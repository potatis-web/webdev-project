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
  $effect(() => {
    localStorage.setItem("user", JSON.stringify(userData))
  })

</script>
<div class="w-screen h-screen grid grid-rows-[1fr_1fr_9fr] grid-cols-[1fr_9fr] gap-1">
  <div class="hl border-b-0 flex justify-center items-center h-full">
    <h1 class="text-blue-50">Quizmaker.gg</h1>
  </div>
  <nav class="hl"></nav>
  <div class="hl border-t-0"></div>
  <div class="hl flex itmes-center p-4">
    <button class="text-blue-50 hover:bg-zinc-700/10 cursor-pointer">+ Add quiz</button>
  </div>
  <aside class="hl"></aside>
  <main class=" hl flex flex-wrap gap-1 p-4">
    {#if userData.ql}
      {#each userData.ql as quiz (quiz.id)}
        <div class="text-blue-50 p-4 h-48 w-1/5 hl">
          {quiz.name}
            <br>
          {quiz.q.length + " questions"}</div>
      {/each}
    {/if}
  </main>
</div>
<style>
  @layer components {
    .hl {
      border: 1px;
      border-style: solid;
      border-color: var(--color-blue-50);
    }
  }
  :global(body) {
    background-color: var(--color-zinc-700);
  }
</style>