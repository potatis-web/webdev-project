<script>
	// Svelte logic
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	// import { slide } from 'svelte/transition'; // remove if unused later

	// Components
	import Notification from '$lib/components/Notification.svelte';
	import Button from '$lib/components/Button.svelte';
	import Card from '$lib/components/Card.svelte';
	

	// Assets
	import waveBG from '$lib/assets/stacked-waves-haikei.svg';
	import waveBGD from '$lib/assets/stacked-waves-haikei-dark.svg';
	
	// Services
	import { logIn, signUp, getCurrentUser } from '$lib/services/auth.js';
	import { isDarkMode } from '$lib/stores/theme.js';
	import InputField from '$lib/components/InputField.svelte';


	// Variables
	let loginState = $state(true);
	let email = $state();
	let password = $state();
  let confirmPassword = $state();
	let notifications = $state([]);

	onMount(async () => {
		const user = await getCurrentUser();
		if (user) {
			console.log(user);
			goto(resolve('/dashboard'));
		}

		
	});

	async function handleSubmit(e) {
		e.preventDefault();
		let response;
		if (loginState) {
			response = await logIn(email, password);
		} else {
      if (confirmPassword === password) {
        response = await signUp(email, password);
      }
			
		}
		console.log(response);

		if (response.success) {
			goto(resolve('/dashboard'));
		} else {
			makeNotification(response.error, 'error');
		}
	}

	function getMode(state = loginState) {
		return state ? 'Log In' : 'Sign Up';
	}

	function makeNotification(text = "Placeholder", type = 'info') {
		const obj = { text: text, id: Date.now(), type: type };
		notifications.push(obj);
		setTimeout(() => notifications.shift(), 5000);
	}
</script>

<title>{getMode()} - Quizmaker.gg</title>
<main class="fixed inset-0 flex items-center justify-center">
	<img src={$isDarkMode ? waveBGD : waveBG} alt="background" class="fixed" />
	<Card>
		<form
			class="relative flex motion-reduce:animation-none flex-col gap-4"
			onsubmit={handleSubmit}
		>
			<h1 class="heading border-b-2 p-2">{getMode()}</h1>
			
			<InputField required={true} preset="email" bind:value={email} />
			<InputField required={true} preset="password" bind:value={password} />
			
			{#if !loginState}
				<InputField required={true} preset="password" text="Confirm Password" bind:value={confirmPassword} />
			{/if}
			<div class="field-wrapper justify-end">
				<Button type="submit">{getMode()}</Button>
			</div>

			<div class="absolute bottom-8">
				<span>{!loginState ? 'Already have an' : 'No '} account?</span>
				<button
					class="cursor-pointer underline"
					onclick={() => {
						loginState = !loginState;
					}}>{getMode(!loginState)}</button
				>
				<span>instead</span>
			</div>
		</form>
	</Card>
</main>

<!--Notifications-->
<aside class="fixed right-4 bottom-4 flex flex-col gap-4">
	{#each notifications as notification (notification.id)}
		<Notification text={notification.text} type={notification.type} />
	{/each}
</aside>