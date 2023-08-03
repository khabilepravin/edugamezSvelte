<script>
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-modern.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import { navigating } from '$app/stores';
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch, Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/navigation/navigation.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { goto } from '$app/navigation';

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
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="lg:hidden btn btn-sm" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<button class="lg:hidden btn btn-sm p-0 m-0" on:click={goHome}>
					<img src="/images/logo.png" alt="MaxSpelling Logo"  /><strong class="text-xl ml-2"
						>MaxSpelling</strong
					>
				</button>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Left sidebar slot -->
	<svelte:fragment slot="sidebarLeft">
		<Navigation />
	</svelte:fragment>

	<svelte:fragment slot="footer" />

	{#if $navigating}
		<Loading />
	{/if}<slot />
</AppShell>
