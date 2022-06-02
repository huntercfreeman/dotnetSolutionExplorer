<script>
	let count = 0;
	
	function handleClick() {
		count += 1;

        tsVscode.postMessage({
            command: 'showMessage',
            text: 'stuff'
        });
	}
</script>

<h1>asspppedpapefd</h1>
<button on:click={handleClick}>
	clicks: {count}
</button>