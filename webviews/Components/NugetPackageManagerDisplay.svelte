<script>
	import { onMount } from 'svelte';
    import { bind } from 'svelte/internal';
	import { NugetPackageModel } from '../../src/Models/NugetPackageModel';
	import NugetPackageEntryDisplay from './NugetPackageEntryDisplay.svelte';

	let testGetRequestResults = {};
	let query = undefined;
	let displayQuery = false;
	let projectFiles = [];
	let selectedProjectFile = undefined;

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

	function getProjects() {
		tsVscode.postMessage({
			command: "getProjects"
		});
	}

	onMount(async () => {
		window.addEventListener("message", async (event) => {
			const message = event.data;
			switch (message.type) {
				case "getProjects":
					projectFiles = message.projects;
			}
		});
	});
</script>

<div>
	<div>
		<button on:click="{getProjects}">Refresh Project List</button>

		<div style="margin-top: 5px;">
			selectedProjectFile: {selectedProjectFile}
		</div>
		<hr/>
		{#each projectFiles as project}
			{#if selectedProjectFile === project}
				<div class="dnse_project-file active" on:click="{() => selectedProjectFile = project}">
					{project}
				</div>
			{:else}
				<div class="dnse_project-file" on:click="{() => selectedProjectFile = project}">
					
					{project}
				</div>
			{/if}
		{/each}
	</div>
	<hr/>

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


