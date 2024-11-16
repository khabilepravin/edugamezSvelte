<script>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-modern.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import { navigating } from '$app/stores';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { AppShell, AppBar, LightSwitch, Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/navigation/navigation.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { goto } from '$app/navigation';
	import { storePopup } from '@skeletonlabs/skeleton';
	import { setContext } from 'svelte';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	function drawerOpen() {
		drawerStore.open({});
	}

	function goHome(){
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
								<img src="/images/logo.png" alt="MaxSpelling Logo"  /><strong class="text-xl ml-2"
									>MaxSpelling</strong
								>
							</button>
						</div>

					
					{/snippet}
				{#snippet trail()}
					
						<LightSwitch />
					
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
