<script>
	import { AppRail, drawerStore, AppRailAnchor } from '@skeletonlabs/skeleton';
	
	function drawerClose() {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/" on:click={drawerClose}>Homepage</a></li>
		<li><a href="/about" on:click={drawerClose}>About</a></li>		
		<li><a href="/feedback" on:click={drawerClose}>Feedback</a></li>
	</ul>
</nav>
