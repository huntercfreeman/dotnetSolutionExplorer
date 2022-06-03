<script>
	let count = 0;

	function handleClick() {
		tsVscode.postMessage({
			command: "reloadTreeView"
		});
	}
</script>

<button on:click={handleClick}>
	Pick a .NET Solution
</button>


