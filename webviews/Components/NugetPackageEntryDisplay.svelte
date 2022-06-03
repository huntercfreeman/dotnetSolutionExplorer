<script>
    import { NugetPackageModel } from "../../src/Models/NugetPackageModel";

	export let entry;

	let expandContents = false;

    function addNugetPackage() {
		tsVscode.postMessage({
			command: "addNugetPackage",
            title: entry.title
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
			Add Nuget Package
		</button>

		<div>
			<pre>{JSON.stringify(entry, null, 2)}</pre>
		</div>
	</div>
{/if}
