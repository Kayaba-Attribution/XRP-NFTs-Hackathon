

<script>
    /* import the ipfs-http-client library */
    //import { create } from 'ipfs-http-client';
    import { xrpl } from "$lib/xrp.js";
	import { secret, address, findNewTokenId } from '$lib/xrpUtils';
    import { onMount } from "svelte";
    import NFT from './nftCardUser.svelte'
    onMount(async () => {
        CleanNFTs = await getNFTS()
    })

        
    const info = {
        "name": "Kayaba Test",
        "description": "XLS-20 standard for NFTs testing", 
        "issuer": "",
        "tokenID": "",
        "image": "", 
    }

    let nfts = []
    let CleanNFTs = []
    //***************************
    //** Get Token *************
    //***************************
    async function getNFTS() {
        const wallet = xrpl.Wallet.fromSeed($secret)
        const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
        await client.connect()
        console.log("Connected to Sandbox")
    
        const res = await client.request({
            method: "account_nfts",
            account: wallet.classicAddress
        })
        console.log(res)

        nfts = res.result.account_nfts
        console.log(nfts)
        var obj;
        for (let i = 0; i < nfts.length; i++) {
            //console.log(xrpl.convertHexToString(nfts[i].URI))
            let url = xrpl.convertHexToString(nfts[i].URI)
            const res = await fetch(url)
                .then(res => res.json())
                .then(data => obj = data)
                //.then(() => console.log(obj))
            console.log("Response:", obj)
            CleanNFTs.push(obj)   
        }
        console.log("NFTs", CleanNFTs)
        

        client.disconnect()
        return CleanNFTs
    } //End of mintToken

    async function refreshInfo() {
        nfts = []
        CleanNFTs = []
        CleanNFTs = await getNFTS()
    }


</script>

<div class="mt-20">
    <div class="text-4xl font-bold text-center my-5">All NFTs Minted Here</div>
    <div>NFTS: {CleanNFTs.length}</div>
    <div class="btn btn-primary" on:click={refreshInfo}>Refresh</div>
    
    <div class="photos">
        {#each CleanNFTs as nft, i}
            <NFT 
                name={nft.name}
                description={nft.description}
                issuer={nfts[i].Issuer}
                tokenID={nfts[i].TokenID}
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
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 8px;
        }
    
        figure, img {
            width: 100%;
            margin: 0;
        }
    </style>