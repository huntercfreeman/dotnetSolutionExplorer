<script>
    import { bind } from 'svelte/internal';
import { NugetPackageModel } from '../../src/Models/NugetPackageModel';
	import NugetPackageEntryDisplay from './NugetPackageEntryDisplay.svelte';
	let count = 0;

	function handleClick() {
		count += 1;

		tsVscode.postMessage({
			command: "showMessage",
			text: "stuff",
		});
	}

	let testGetRequestResults = {};
	let query = undefined;

	function testGetRequest() {
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

<button on:click={handleClick}>
	clicks: {count}
</button>


<div>
	{#if query}
		{`https://azuresearch-usnc.nuget.org/query?q=${query}&prerelease=false`}
	{:else}
		query is undefined
	{/if}
</div>

<input bind:value={query}>

<button on:click={testGetRequest}> testGetRequest </button>

{#each testGetRequestResults as entry}
	<NugetPackageEntryDisplay entry="{new NugetPackageModel(entry.title)}" />
{/each}


