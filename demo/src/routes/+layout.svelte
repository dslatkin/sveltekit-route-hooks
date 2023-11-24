<script>
	import './styles.css';
</script>

<header>
	<nav>
		<ul>
			<li>
				<a href="/">Home</a>
			</li>
			<li>
				<a href="/launch-codes">Launch Codes</a>
			</li>
			<li>
				<a href="/client-only">Client-Only Hooks</a>
			</li>
			<li>
				Browse fruits
				<ul>
					<li><a href="/apples">Apples</a></li>
					<li><a href="/bananas">Bananas</a></li>
					<li><a href="/cherries">Cherries</a></li>
				</ul>
			</li>
		</ul>
	</nav>
</header>

<main>
	<slot />
</main>
