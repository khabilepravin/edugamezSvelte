<script context="module">
	export const prerender = true;
</script>

<svelte:head>
	<title>MaxSpelling - Get better at spelling</title>
</svelte:head>

<div id="games">
	<!-- Features -->
	<div class="cards-1 bg-gray">
		<div class="container">
			<div class="row">
				<div class="col-lg-12">
					<h4 class="h2-heading">Spelling Practice</h4>
					<h5 class="h2-heading">Select a Level</h5>
				</div>
				<!-- end of col -->
			</div>
			<!-- end of row -->
			<div class="row">
				<div class="col-lg-12">
					<div class="cards-container">
						<!-- Card -->
						<a href="/spelling/low" class="link-no-decoration">
							<div class="card">
								<img src="images/beginner.png" alt="spelling" class="card-img-top tile-image" />
								<div class="card-body">
									<h5 class="card-title text-center">
										<a href="/spelling/low" class="link-no-decoration">Beginner</a>
									</h5>

									<p class="text-center">Baby Steps</p>
								</div>
							</div>
						</a>
						<!-- end of card -->

						<!-- Card -->
						<a href="/spelling/medium" class="link-no-decoration">
							<div class="card">
								<img src="images/inter.png" alt="Map games" class="card-img-top tile-image" />
								<div class="card-body">
									<h5 class="card-title text-center">
										<a href="/spelling/medium" class="link-no-decoration">Intermediate</a>
									</h5>
									<p class="text-center">Quite Proficient</p>
								</div>
							</div>
						</a>

						<a href="/spelling/high" class="link-no-decoration">
							<div class="card">
								<img src="images/advanced.png" alt="Flag games" class="card-img-top tile-image" />
								<div class="card-body">
									<h5 class="card-title text-center">
										<a href="/spelling/high" class="link-no-decoration">Advanced</a>
									</h5>
									<p class="text-center">Pro At It</p>
								</div>
							</div>
						</a>
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

	.tile-image {
		height: 150px !important;
		width: 150px !important;
		align-self: center;
 	} 
</style>
