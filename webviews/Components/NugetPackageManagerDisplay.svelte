<script>
    import { bind } from 'svelte/internal';
	import { NugetPackageModel } from '../../src/Models/NugetPackageModel';
	import NugetPackageEntryDisplay from './NugetPackageEntryDisplay.svelte';

	let testGetRequestResults = {};
	let query = undefined;
	let displayQuery = false;

	function sendGetRequest() {
		fetch(
			`https://azuresearch-usnc.nuget.org/query?q=${query}&prerelease=false`
		)
			.then((response) => response.json())
			.then((data) => {
				testGetRequestResults = data.data.map(entry => entry);
			})
			.catch((error) => {
				console.log(error);
				return [];
			});
	}
</script>

<div>
	<div>
		Select a Project to manage
	</div>

	<div>
		Display generated GET request: <input type="checkbox" bind:value={displayQuery}>
	</div>

	{#if displayQuery}
		<div>
			GET request:&nbsp;
			{#if query}
				{`https://azuresearch-usnc.nuget.org/query?q=${query}&prerelease=false`}
			{:else}
				query is undefined
			{/if}
		</div>
	{/if}
</div>

<form on:submit|preventDefault={() => sendGetRequest()}>
    <input bind:value={query}>

	<button on:click={sendGetRequest}> send GET request </button>
</form>

{#each testGetRequestResults as entry}
	<NugetPackageEntryDisplay entry="{new NugetPackageModel(entry.title)}" />
{/each}


