<script>
    import { NugetPackageModel } from "../../src/Models/NugetPackageModel";
	import { onMount } from 'svelte';

	export let entry;
	export let selectedProjectFile;

	let expandContents = false;

    function addNugetPackage() {
		tsVscode.postMessage({
			command: "addNugetPackage",
            nugetPackage: entry,
			selectedProjectFile: selectedProjectFile
		});
	}

	function toggleExpand() {
		expandContents = !expandContents;
	}
</script>

<div on:click="{toggleExpand}" class="dnse_nuget-package-entry">{entry.title} +</div>

{#if expandContents}
	<div style="margin-left: 15px;">
		<button on:click="{addNugetPackage}">
			Add Nuget Package To {selectedProjectFile.filename}
		</button>

		<div>
			<pre>{JSON.stringify(entry, null, 2)}</pre>
		</div>
	</div>
{/if}
