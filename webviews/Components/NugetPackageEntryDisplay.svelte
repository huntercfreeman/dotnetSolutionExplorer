<script>
    import { NugetPackageModel } from "../../src/Models/NugetPackageModel";

	export let entry;

    function addNugetPackage() {
		tsVscode.postMessage({
			command: "addNugetPackage",
            title: entry.title
		});
	}
</script>

<div on:click="{addNugetPackage}" class="dnse_nuget-package-entry">{entry.title} +</div>