
<script>
    import { onMount } from "svelte";
	import NFT from '../nftCard.svelte'


	let nfts = [];
    onMount(async () => {
        const res = await fetch(`/api/nfts`);
        nfts = await res.json()
		console.log(nfts[0])
    })
</script>
<div class="mt-20">
<div class="text-4xl font-bold text-center my-5">All NFTs Minted Here</div>

<div class="photos">
	{#each nfts as nft}
		<NFT 
			name={nft.name}
			description={nft.description}
			issuer={nft.issuer}
			tokenID={nft.tokenID}
			image={nft.image}
		/>
	{:else}
		<!-- this block renders when photos.length === 0 -->
		<p>loading...</p>
	{/each}
</div>
</div>

<style>
	.photos {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-gap: 8px;
	}

	figure, img {
		width: 100%;
		margin: 0;
	}
</style>