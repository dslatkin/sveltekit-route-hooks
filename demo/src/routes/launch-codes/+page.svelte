<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<p>Launch codes:</p>

<ul>
	{#each data.launch_codes as code}
		<li><a href="/launch-codes/{code}">{code}</a></li>
	{/each}
</ul>
