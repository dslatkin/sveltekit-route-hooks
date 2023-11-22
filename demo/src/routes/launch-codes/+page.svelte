<script>
	/** @type {import('./$types').PageData} */
	export let data;
</script>

<p>Launch codes:</p>

<ul>
	{#each data.launch_codes as code}
		<li>{code}</li>
	{/each}
</ul>
