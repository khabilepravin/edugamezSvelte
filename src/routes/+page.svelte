<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<svelte:head>
	<title>MaxSpelling-Up Your Spelling Game</title>
</svelte:head>
<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-3 text-center flex flex-col items-center">
		<h2 class="h2 my-2">Welcome to MaxSpelling</h2>
		<h4 class="h4">Select your level to practice</h4>
		<!-- Animated Logo -->

		<div class="columns-1 md:columns-3">
			<a class="block card card-hover" href="/spelling/low">
				<header class="card-header">
					<img
						src="images/beginner.webp"
						class="object-cover h-40 w-30"
						alt="spelling beginner level"
					/>
				</header>
				<section class="p-4">Beginner</section>
				<!-- <footer class="card-footer">Subtext</footer> -->
			</a>
			<a class="block card card-hover my-3" href="/spelling/medium">
				<header class="card-header">
					<img
						src="images/inter.webp"
						class="object-cover h-40 w-30"
						alt="spelling beginner level"
					/>
				</header>
				<section class="p-4">Intermediate</section>
				<!-- <footer class="card-footer">Subtext</footer> -->
			</a>
			<a class="block card card-hover my-3" href="/spelling/high">
				<header class="card-header">
					<img
						src="images/advanced.webp"
						class="object-cover h-40 w-30"
						alt="spelling beginner level"
					/>
				</header>
				<section class="p-4">Advanced</section>
				<!-- <footer class="card-footer">Subtext</footer> -->
			</a>
		</div>
	</div>
</div>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure svg,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite, glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
