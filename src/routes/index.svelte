<script context="module">
	export const prerender = true;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div id="games">
	<!-- Features -->
	<div class="cards-1 bg-gray">
		<div class="container">
			<div class="row">
				<div class="col-lg-12">
					<h2 class="h2-heading">Webly's <span class="blue">Games</span></h2>
				</div>
				<!-- end of col -->
			</div>
			<!-- end of row -->
			<div class="row">
				<div class="col-lg-12">
					<div class="cards-container">
						<!-- Card -->
						<div class="card">
							<span class="fa-stack">
								<i class="fas fa-circle fa-stack-2x" />
								<i class="fas fa-school fa-stack-1x" />
							</span>
							<div class="card-body">
								<h5 class="card-title">
									<a href="/spelling" class="link-no-decoration">Spelling</a>
								</h5>
								<p>Practice spelling almost like you are participating in an actual competition</p>
							</div>
						</div>
						<!-- end of card -->

						<!-- Card -->
						<div class="card">
							<span class="fa-stack">
								<i class="fas fa-circle fa-stack-2x" />
								<i class="fas fa-map fa-stack-1x" />
							</span>
							<div class="card-body">
								<h5 class="card-title"><a href="/map" class="link-no-decoration">Map</a></h5>
								<p>Get better at geography, with a fun map game</p>
							</div>
						</div>
						<!-- end of card -->

						<!-- Card -->
						<div class="card">
							<span class="fa-stack">
								<i class="fas fa-circle fa-stack-2x" />
								<i class="fas fa-flag fa-stack-1x" />
							</span>
							<div class="card-body">
								<h5 class="card-title">Flags</h5>
								<p>Extend your Knowledge about any country</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.link-no-decoration {
		text-decoration: none;
	}
</style>
