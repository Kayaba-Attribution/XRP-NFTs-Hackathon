
<script>
    import { onMount } from "svelte";
	import NFT from '../nftCard.svelte'
	import { secret, address, findNewTokenId } from '$lib/xrpUtils';



	let nfts = [];
    onMount(async () => {
        const res = await fetch(`/api/nfts`);
        nfts = (await res.json()).reverse()
		console.log(nfts[0])
    })
</script>
<div class="mt-20">
<div class="text-4xl font-bold text-center my-5">All NFTs Minted Here</div>

{#if !$secret}
	<div class="alert alert-error shadow-lg my-5">
	<div>
	<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
	<span>You are not logged in! Please connect (button is in navabar)</span>
	</div>
	</div>
{/if}

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">


    
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