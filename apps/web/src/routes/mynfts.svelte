

<script>
    /* import the ipfs-http-client library */
    //import { create } from 'ipfs-http-client';
    import { xrpl } from "$lib/xrp.js";
	import { secret, address, findNewTokenId } from '$lib/xrpUtils';
    import { onMount } from "svelte";
    import NFT from './nftCard.svelte'
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
    {#if !$secret}
        <div class="alert alert-error shadow-lg my-5">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>You are not logged in! Please connect (button is in navabar)</span>
        </div>
        </div>
    {/if}
    <div class="text-4xl font-bold text-center my-5">Manage Your NFTs</div>
    <div class="text-center">NFTS: {CleanNFTs.length}</div>
    <div class="flex justify-center my-5">
        <div class="btn btn-primary" on:click={refreshInfo}>Refresh</div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {#each CleanNFTs as nft, i}
            <NFT 
                name={nft.name}
                description={nft.description}
                issuer={nfts[i].Issuer}
                tokenID={nfts[i].TokenID}
                image={nft.image}
                owner={true}
            />
        {:else}
            <!-- this block renders when photos.length === 0 -->
            <div class="text-4xl font-bold text-center my-5">You Dont Have NFTs</div>
            <div class="flex justify-center md:justify-start py-2">
                <button class="btn btn-primary">
                    <a href="/mint">
                        Mint Your Own NFT!!
                    </a>
                </button>
                <button class="btn btn-primary ml-3">
                    <a href="/nfts">
                       See All NFTs
                    </a>
                </button>
            </div>

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