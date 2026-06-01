<script>
  // Svelte logic
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
  import { goto } from '$app/navigation';


	// Components
	import Notification from '$lib/components/Notification.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Button from '$lib/components/Button.svelte';


	// Services
	import { getQuizById, updateQuiz } from '$lib/services/quizManager';
	import InputField from '$lib/components/InputField.svelte';
	import { fade } from 'svelte/transition';
	


	// Constants
	const questionTemplate = {
		title: 'Sample question?',
		options: [
			{
				text: 'Option 1',
				value: 'option1',
			},
			{
				text: 'Option 2',
				value: 'option2',
			},
		],
	};

	const optionTemplate = {
		text: 'Option 1',
		value: 'option1',
		is_correct: false,
	}

	// Variables
	let currentQuiz = $state();
	let storedQuiz;
	let questions = $derived(currentQuiz?.questions ?? []);
	let currentQuestionIdx = $state(0);
	let currentQuestion = $derived(questions[currentQuestionIdx]);
	let currentOptions = $derived(currentQuestion?.options ?? [])
	let hasChanges = $derived(JSON.stringify(currentQuiz) !== JSON.stringify(storedQuiz));



	// State
	let notifications = $state([]);
	let modalOpen = $state(false);
	
	// Constants
	const btns = [
		{
			func: () => goto(resolve(`/play/${page.params.id}`)),
			text: "Play"
		},
		{
			func: () => 
				currentQuiz.questions = [
					...currentQuiz.questions, 
					{ 
						...structuredClone(questionTemplate),
						id: `${currentQuiz.id}-${crypto.randomUUID()}` 
						}
					],
				
			text: "Add"
		},
		{
			func: () => questions.splice(currentQuestionIdx, 1),
			text: "Delete"
		},
		{
			func: () => {
				if (hasChanges) {
					const confirmed = confirm('You have unsaved changes. Leave anyway?')
					if (!confirmed) return;
				}
				goto(resolve('/dashboard'))},
			text: "Dashboard"
		}
	]
	onMount(async () => {
		await getQuiz();
		const handler = (event) => {
			if (!hasChanges) return;
			event.preventDefault(); 
		}

		window.addEventListener('beforeunload', handler);

		return () => {
			window.removeEventListener('beforeunload', handler);
		};
	});

	function makeNotification(text, type = 'info') {
		const obj = { text: text, id: Date.now(), type: type };
		notifications.push(obj);
		setTimeout(() => notifications.shift(), 5000);
	}

	async function getQuiz() {
		storedQuiz = await getQuizById(page.params.id);
		if (storedQuiz === null) {
			makeNotification("Something went wrong went fetching quiz", "error"); 
			return;
		}
		currentQuiz = structuredClone(storedQuiz);
	}
	async function handleUpdateQuiz() {
		if (!currentQuiz?.name.trim()) {
			makeNotification("A quiz name is required! Please add one before saving", "warn");
			return;
		}
		if (!questions.length) {
			makeNotification("Quiz needs at least 1 question! Please add one before saving");
			return;
		}
		const response = await updateQuiz(page.params.id, currentQuiz);
		if (response.success) {
			makeNotification("Successfully saved quiz!", "info");
			await getQuiz();
		} else {
			makeNotification("Something went wrong when saving", "error");
		}
		
	}
</script>

{#if currentQuiz}
	<title>{currentQuiz.name ? currentQuiz.name : 'Empty'} - Quizmaker.gg</title>
	
	<main class="fixed inset-1 grid grid-cols-[400px_1fr] grid-rows-[1fr_275px] shadow">
		<aside class="z-10 row-span-2 flex flex-col items-center gap-4 shadow">
			<div class="grid h-40 w-full grid-cols-2 grid-rows-3">
				<div class="row-span-2 flex items-center justify-around">
					<h1 class="">{currentQuiz.name}</h1>
					<button aria-label="settings" class="btn-primary" onclick={() => (modalOpen = true)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							class="size-6"
						>
							<path
								fill-rule="evenodd"
								d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</div>
				<div class="row-span-2">
					<!--Image picker-->
					<div
						class="relative flex h-full w-full items-center justify-center border-soft-linen-200"
					>
						<img src={currentQuiz.image} alt="quiz thumbnail" class="h-full w-full object-fill bg-soft-linen-200" />
						<label for="thumbnail" class="absolute right-1 bottom-1 cursor-pointer">
							<!--"arrow-up-tray" on https://heroicons.com/ -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6 rounded bg-black/10 p-1 text-dusk-blue-800"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
								/>
							</svg>
						</label>
						<input
							id="thumbnail"
							type="file"
							class="hidden"
							accept="image/*"

						/>
					</div>
				</div>

				<!--Sidebar controls for question management-->
				<div
					class="col-span-2 flex flex-row items-center justify-around border-b-soft-linen-200 p-8 shadow gap-2 *:w-2/5"
				>
					{#each btns as btn (btn.text)}
						<Button func={btn.func}>{btn.text}</Button>
					{/each}
				</div>
			</div>

			<!--Question sidebar-->
			<div class="flex h-full w-full flex-col items-center gap-4 overflow-y-scroll p-4">
				{#each questions as question, i (question.id)}
					<button
						class={`border border-soft-linen-300 hover:bg-soft-linen-300 transition cursor-pointer active:scale-95 shadow w-7/8 text-xl flex justify-center items-center rounded-[999px] p-5 truncate ${question.title?.trim() ? '' : 'text-neutral-500'} ${currentQuestionIdx === i ? 'border-2' : ''}`}
						onclick={() => {currentQuestionIdx = i}}>
						{question.title?.trim() ? question.title : '- Empty -'}</button
					>
				{/each}
			</div>
		</aside>

		<div class="flex flex-col items-center justify-around ">
			<!--Question title input-->
			<input
				placeholder="Example: What's your favourite color?"
				class="text-field w-9/10 border-b text-4xl"
				bind:value={currentQuestion.title}

			/>

			<!--Options text/value input-->
			<div class="h-full w-9/10 flex flex-wrap gap-4">

				{#each currentOptions as option, i (i)}
					<div transition:fade class="relative flex justify-center flex-col grow rounded *:p-2 *:text-center gap-2 border border-soft-linen-300 p-2 " >
						<input class=" border-soft-linen-300 shadow border rounded" bind:value={option.text} />
						<input class="text-dusk-blue-800/70 border-soft-linen-300 shadow border rounded" bind:value={option.value} />
						<button class="absolute right-0 bottom-0" onclick={() => currentOptions.splice(i,1)}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
							</svg>
						</button>
					</div>
				{/each}
				{#if currentQuestion.options.length < 4}
					<button class="grow border min-w-1/3 *:p-2 text-center flex justify-center bg-black/10 transition items-center" onclick={() => currentQuestion.options.push(optionTemplate)}>+</button>
				{/if}
			</div>
		</div>
		<div class=""></div>
	</main>
{:else}
	<!--Error/not found page-->
	<title>Quiz not found - Quizmaker.gg</title>
	<main class="flex h-screen items-center justify-center">
		<div class="relative flex flex-col items-center gap-8 *:text-center">
			<div
				class="h-24 w-24 animate-spin rounded-full border-16 border-dry-sage-200 border-t-dusk-blue-500"
			></div>
			
			<h1 class="text-2xl">Quiz may not be available right now. Refresh or try again later.</h1>
			<h2>QuizID: <span class="text-dusk-blue-600">{page.params.id}</span></h2>
			<Button func={() => {goto(resolve('/dashboard'))}}>Back to Dashboard</Button>
		</div>
	</main>
{/if}

<!--Notifications-->
<aside class="fixed right-4 bottom-4 z-50 flex flex-col gap-4">
	{#each notifications as not (not.id)}
		<Notification text={not.text} type={not.type} />
	{/each}
</aside>

{#if hasChanges}
	<Button class="fixed left-4 bottom-4" func={handleUpdateQuiz}>
		<div class="relative inline-flex">
			<span>●</span>
			<span class="absolute animate-ping">●</span>
		</div>
		<span>Save Changes</span>
	</Button>
{/if}

<!--Modal-->
{#if modalOpen}
	<Modal bind:modalState={modalOpen}>
		<h1 class="heading">Quiz details</h1>
		<InputField text="Quiz name:" bind:value={currentQuiz.name} placeholder="My quiz about countries"/>
		<InputField text="Quiz description:" bind:value={currentQuiz.description} placeholder="Test yourself on the world!" />
		<InputField text="Image url:" bind:value={currentQuiz.image} />
	</Modal>
{/if}