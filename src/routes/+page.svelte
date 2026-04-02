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

<div class="absolute bg-blue-950 shadow-blue-700 shadow-[0_0_10000px] blur-2xl -left-64 -top-64 w-2xl h-192 rounded-full -z-10"></div>

<div class="[&>*]:hl [%>*]:backdrop-blur-xl w-screen h-screen grid grid-rows-[1fr_1fr_9fr] grid-cols-[1fr_9fr] gap-1">
  <div class=" border-b-0 flex justify-center items-center h-full">
    <h1 class="text-blue-50">Quizmaker.gg</h1>
  </div>
  <nav></nav>
  <div class="border-t-0"></div>
  <div class="flex items-center gap-4 p-4">
    <h2 class="text-blue-50">Quizzes</h2>
    <button class="text-blue-50 hover:bg-blue-700 cursor-pointer shadow-2xl h-8 bg-blue-600">+ Add quiz</button>
  </div>
  <aside class=""></aside>
  <main class="  flex flex-wrap gap-1 p-4">
    {#if userData.ql}
      {#each userData.ql as quiz (quiz.id)}
        <div class="text-blue-50 p-4 h-48 w-1/5 ">
          {quiz.name}
            <br>
          {quiz.q.length + " questions"}</div>
      {/each}
    {/if}
  </main>
</div>
<style>
  /*Pending fix for class used by TailwindCSS*/
  :global(.hl) {
    content: "";
    /*@apply border border-blue-50 border-solid;*/
  }
  :global(body) {
    background-color: var(--color-gray-950);
  }
</style>