<script>
	import { page } from '$app/stores';
	import logo from './svelte-logo.svg';
</script>

<nav class="navbar navbar-expand-lg fixed-top navbar-light">
	<div class="container">
		<a class="navbar-brand logo-image" href="/"><img src="images/logo.svg" alt="alternative" /></a>
		<button class="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
			<span class="navbar-toggler-icon" />
		</button>
		<div class="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
			<ul class="navbar-nav ml-auto">
				<li class="nav-item">
					<a class="nav-link page-scroll" href="index.html#header"
						>Home <span class="sr-only">(current)</span></a
					>
				</li>
				<li class="nav-item">
					<a class="nav-link page-scroll" href="#pricing">Pricing</a>
				</li>
				<li class="nav-item">
					<a class="nav-link page-scroll" href="#contact">Contact</a>
				</li>
			</ul>
			<span class="nav-item">
				<a class="btn-outline-sm">Log In</a>
			</span>
		</div>
	</div>
</nav>
<!--<header id="header" class="header">
	 <div class="container">
		<div class="row">
			<div class="col-lg-12">
				<div class="text-container">
					<h1 class="h1-large">Play to Enhance Your Knowledge</h1>
					<p class="p-large p-heading"></p>
					<a class="btn-solid-lg page-scroll" href="#games">Discover</a>
				</div> 
			</div> 
		</div> 
	</div>  
	
</header>-->
