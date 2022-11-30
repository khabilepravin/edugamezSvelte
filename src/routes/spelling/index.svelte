<svelte:head>
	<title>Spelling Game</title>
</svelte:head>

<div class="text-center">
	<div class="container">
		<div class="row">
			<div class="col-sm">
				<h5>Select Level of Difficulty</h5>
			</div>
		</div>
		<div class="row">
			<div class="col-sm">
				<a
					class="btn btn-success btn-sm btn-block link-no-decoration"
					role="button"
					href="/spelling/game?difficulty=low">Easy</a
				>				
			</div>
		</div>
		<div class="row">
			<div class="col-sm">
				<a
					class="btn btn-info btn-sm btn-block link-no-decoration"
					role="button"
					href="/spelling/game?difficulty=medium">Hard</a
				>
			</div>
		</div>
		<div class="row">
			<div class="col-sm">
				<a
					class="btn btn-warning btn-sm btn-block link-no-decoration"
					role="button"
					href="/spelling/game?difficulty=high">Challenging</a
				>
			</div>
		</div>
	</div>
</div>

<style>
	.link-no-decoration {
		text-decoration: none;
	}
</style>
