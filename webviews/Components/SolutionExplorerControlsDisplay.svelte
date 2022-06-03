<script>
	let count = 0;

	function handleClick() {
		count += 1;

		tsVscode.postMessage({
			command: "showMessage",
			text: "SolutionExplorerControlsDisplay.svelte",
		});
	}
</script>

<h3>SolutionExplorerControlsDisplay.svelte</h3>

<button on:click={handleClick}>
	clicks: {count}
</button>


