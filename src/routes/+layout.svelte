<script>
	// The ordering of these imports is critical to your app working properly
	//import '@skeletonlabs/skeleton/themes/theme-modern.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	//import '@skeletonlabs/skeleton/styles/skeleton.css';
	import { navigating } from '$app/stores';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { createClient } from '@supabase/supabase-js';
	import { popup } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	//import { page } from '$app/stores';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import {
		AppShell,
		AppBar,
		LightSwitch,
		Drawer,
		getDrawerStore,
		initializeStores
	} from '@skeletonlabs/skeleton';
	import Navigation from '$lib/navigation/navigation.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { goto } from '$app/navigation';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { onMount, setContext } from 'svelte';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children, data } = $props();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	initializeStores();

	let userName = $state();
	//let data = $props();
	const drawerStore = getDrawerStore();

	onMount(async () => {
		console.log(data);
		// const userData = await supabase.auth.getUser();
		if (data) {
			//	debugger;
			const userFullName = data.data.user_metadata.full_name;
			console.log(userFullName);
			if (userFullName) {
				const nameArray = userFullName.trim().split(' ');
				userName = nameArray[0];
			}
		}
	});

	async function handleSignout() {
		const supabase = createClient(
			import.meta.env.VITE_ENV_supabaseUrl,
			import.meta.env.VITE_ENV_supabasekey
		);

		await supabase.auth.signOut();

		window.location.href = '/';
	}

	function drawerOpen() {
		drawerStore.open({});
	}

	function goHome() {
		goto('/');
	}

</script>

<Drawer><Navigation /></Drawer>
<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
	{#snippet header()}
		<!-- App Bar -->
		<AppBar>
			{#snippet lead()}
				<div class="flex items-center">
					<button class="lg:hidden btn btn-sm" onclick={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<button class="btn btn-sm p-0 m-0" onclick={goHome}>
						<img src="/images/logo.png" alt="MaxSpelling Logo" /><strong class="text-xl ml-2"
							>MaxSpelling</strong
						>
					</button>
				</div>
			{/snippet}
			{#snippet trail()}
				<div class="relative">
					<button
						class="btn-base"
						use:popup={{
							event: 'click',
							target: 'userMenu',
							placement: 'bottom'
						}}
					>
						<h5 class="h5">{userName}</h5>
					</button>

					<div class="card p-4 w-48 shadow-xl" data-popup="userMenu">
						<nav class="list-nav">
							<ul class="space-y-2">
								<li>
									<a href="/profile" class="block hover:text-primary-500 transition-colors">
										Profile
									</a>
								</li>
								<li>
									<a href="/dashboard" class="block hover:text-primary-500 transition-colors">
										Dashboard
									</a>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			{/snippet}
		</AppBar>
	{/snippet}
	
	<!-- Left sidebar slot -->
	{#snippet sidebarLeft()}
		<Navigation />
	{/snippet}

	{#snippet footer()}
		<!-- <svelte:fragment  /> -->
	{/snippet}

	{#if $navigating}
		<Loading />
	{/if}

	{@render children?.()}
</AppShell>
