
<script>
    let text = 'test';

    async function addNFT() {
        try {
            const todo = {
                text, 
            }
            const response = await fetch('/nfts', {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(todo)
            })
            var res = await response.json()
            console.log(res)
        } catch (e) {
            console.log("ERROS", e)
        }

    }

</script>

<div class="mt-20">
    <h2>TESTING</h2>
    <h2>text: {text}</h2>
    <input type="text" bind:value={text} placeholder="Type here" class="input input-bordered input-primary w-full max-w-xs">

    <button class="btn btn-success" on:click={addNFT}>Post NFT</button>


</div>


