<script>
    import { page } from '$app/stores';

    /** @type {import('./$types').PageData} */
    export let data;

    $: code = $page.params.code;
    $: badCode = !data.launch_codes.includes(code);
</script>

<h2>Launch code</h2>

<p><code>{code}</code></p>

{#if badCode}
    <p>⚠️ Bad launch code</p>
{/if}

<style>
    code {
        font-family: 'Courier New', Courier, monospace;
        border: 1px solid #ccc;
        background: #222;
        padding: 0.5rem;
        margin-left: 0.25rem;
        margin-right: 0.25rem;
        border-radius: 0.25rem;
    }
</style>
