<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { createClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

	let data = $props();
	const supabase = createClient(
		import.meta.env.VITE_ENV_supabaseUrl,
		import.meta.env.VITE_ENV_supabasekey
	);

	//TODO: This is super stupid hack, do the whole auth on the server instead.
	let showLogin = $state(false);

	const redirectTo = $page.url.searchParams.get('redirectTo') || '/';

	async function handleLogin() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}${redirectTo}`
			}
		});

		if (!error) {
			goto(redirectTo);
		}
	}

	onMount(async () => {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (user) {
			goto(redirectTo);
		} else {
			showLogin = true;
		}
	});
</script>

<div class="h-screen flex items-center justify-center">
	<button class="btn variant-filled" onclick={handleLogin}> Login </button>
</div>
