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
				<nav>
					<ul class="navbar-nav ml-auto">
						<li class="nav-item">
							<a class="nav-link" href="/spelling/game?difficulty=low">Low</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="/spelling/game?difficulty=medium">Medium</a>
						</li>
						<li class="nav-item">
							<a class="nav-link" href="/spelling/game?difficulty=high">High</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
</div>
