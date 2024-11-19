<script>
	import { AppRail, getDrawerStore, AppRailAnchor } from '@skeletonlabs/skeleton';
	
	const drawerStore = getDrawerStore();
	function drawerClose() {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a href="/" onclick={drawerClose}>Home</a></li>
		<li><a href="/about" onclick={drawerClose}>About</a></li>		
		<li><a href="/feedback" onclick={drawerClose}>Feedback</a></li>
	</ul>
</nav>
