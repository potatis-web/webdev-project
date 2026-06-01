<script>
  // Svelte logic
	import { onMount } from "svelte";
	import { page } from "$app/state";
  import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
  
  // Components
  import Button from "$lib/components/Button.svelte";

  // Services 
  import { getQuizById } from "$lib/services/quizManager";
	
	


  // Variables
  let quiz = $state();
  let notifications = $state([]);
  let currentQuestionIdx = $state(0);
  let questions = $derived(quiz.questions);
  let currentQuestion = $derived(questions[currentQuestionIdx]);
  let answers = $state([]);


  onMount(async () => {
    const response = await getQuizById(page.params.id)
    if (response) {
      quiz = response;
    } else {
      makeNotification("An error occurred while loading", "error")
    }
  });

  function makeNotification(text, type = 'info') {
		const obj = { text: text, id: Date.now(), type: type };
		notifications.push(obj);
		setTimeout(() => notifications.shift(), 5000);
	}

</script>

<main class="fixed inset-1 grid grid-rows-[100px_1fr]">
  {#if quiz}
    
    <!--Top bar-->
    <div class="flex justify-center items-center bg-soft-linen-100 shadow rounded-[999px]">
      <h1 class="heading">{quiz.name}</h1>
      <p class="heading absolute right-6">{currentQuestionIdx + 1 <= questions.length ? currentQuestionIdx + 1 : questions.length} / {questions.length}</p>
    </div>

    <!--Content-->
    <div>
      {#if currentQuestionIdx < questions.length}
        <title>Playing {quiz.name} - Quizmaker.gg</title>
        <h2 class="text-center heading p-4">{currentQuestion.title}</h2>
        <div class="flex gap-4 flex-wrap w-full justify-center p-4">
          {#each currentQuestion.options as option, i (i)}
            <button class="w-4/10 text-xl border border-soft-linen-300 shadow  hover:bg-black/10 active:bg-black/20 rounded grow p-4" onclick={() => {currentQuestionIdx++; answers.push({is_correct: option.is_correct, value: option.value})}}>{option.text}</button>
          {/each}
        </div>
      {:else}
        <title>Results of {quiz.name} - Quizmaker.gg</title>
        <div class="flex flex-col items-center gap-4 max-w-2xs">
          {#each answers as answer, i (i)}
            <div class="w-full">
              <h3 class="heading">{questions[i].title}</h3>
              <div class="*:flex *:justify-between">
                <p>
                  Correct: 
                  <span class="italic">{answer.is_correct ? "Yes" : "No"}</span>
                </p>
                <p>
                  Value: 
                  <span class="italic">{answer.value}</span>
                </p>
              </div>
            </div>
          {/each}
          <Button func={() => goto(resolve(`/quiz/${page.params.id}`))}>Back to quiz</Button>
        </div>
      {/if}
    </div>
  {/if}
</main>

<!--Notifications-->
<aside class="fixed right-4 bottom-4 z-50 flex flex-col gap-4">
	{#each notifications as not (not.id)}
		<Notification text={not.text} type={not.type} />
	{/each}
  
</aside>