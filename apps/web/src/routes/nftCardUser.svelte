
<script>
    export let name = 'Default Name'
    export let description = 'Defatult Description'
    export let image = './test.png'
    export let issuer = 'testaddress'
    export let tokenID = 'testID000'

    import { xrpl } from "$lib/xrp.js";
	import { secret, address, findNewTokenId } from '$lib/xrpUtils';


    //***************************
    //** Burn Token *************
    //***************************

    async function burnToken(_tokenID) {
        const wallet = xrpl.Wallet.fromSeed($secret)
        const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
        await client.connect()
        console.log("Connected to Sandbox")

        // Prepare transaction -------------------------------------------------------
        const transactionBlob = {
            "TransactionType": "NFTokenBurn",
            "Account": wallet.classicAddress,
            "TokenID": _tokenID
        }

        // Submit signed blob --------------------------------------------------------
        const tx = await client.submitAndWait(transactionBlob,{wallet})
        const nfts = await client.request({
            method: "account_nfts",
            account: wallet.classicAddress
        })
        console.log(nfts)
        // Check transaction results -------------------------------------------------
        console.log("Transaction result:", tx.result.meta.TransactionResult)
        console.log("Balance changes:",
            JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
        client.disconnect()
    }
    // End of burnToken()

    //********************************
    //** Create Sell Offer ***********
    //********************************

    async function createSellOffer(_tokenId) {
        const wallet = xrpl.Wallet.fromSeed($secret)
        const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
        await client.connect()
        console.log("Connected to Sandbox")

        // Prepare transaction -------------------------------------------------------
        const transactionBlob = {
                "TransactionType": "NFTokenCreateOffer",
                "Account": wallet.classicAddress,
                "TokenID": _tokenId,
                "Amount": String(sellPrice * 10**6),
                "Flags": parseInt(1)
        }

        console.log(transactionBlob)

        // Submit signed blob --------------------------------------------------------

        const tx = await client.submitAndWait(transactionBlob,{wallet})//AndWait


        console.log("***Sell Offers***")
        let nftSellOffers
            try {
                nftSellOffers = await client.request({
                method: "nft_sell_offers",
                tokenid: tokenId.value
            })
            } catch (err) {
                console.log("No sell offers.")
            }
        console.log(JSON.stringify(nftSellOffers,null,2))
        console.log("***Buy Offers***")
        let nftBuyOffers
        try {
            nftBuyOffers = await client.request({
            method: "nft_buy_offers",
            tokenid: tokenId.value })
        } catch (err) {
            console.log("No buy offers.")
        }
        console.log(JSON.stringify(nftBuyOffers,null,2))

        // Check transaction results -------------------------------------------------
        console.log("Transaction result:",
            JSON.stringify(tx.result.meta.TransactionResult, null, 2))
        console.log("Balance changes:",
            JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
        client.disconnect()
        // End of createSellOffer()
        }

    let offer = false;
    let sellPrice;

    function setForOffer(){
        offer = !offer
    }


</script>


<div class="card w-80 bg-base-100 shadow-xl">
    <figure class="px-5 py-5 bg-slate-600">
        <img src={image} alt="Shoes" class="rounded-xl w-full" />
    </figure>
    <div class="card-body items-center text-center">
        <h2 class="card-title">{name}</h2>
        <p>{description}</p>
        <p>Issuer:</p>
        <div class="badge badge-outline badge-sm">{issuer}</div>
        <p>Token ID:</p>
        <div class="badge badge-outline badge-sm text-xs">{tokenID.slice(0, 16)}...{tokenID.slice(-16)}</div>
        <div class="card-actions">
        <button class="btn btn-primary" on:click={() => burnToken(tokenID)}>Burn NFT</button>
        <button class="btn btn-primary" on:click={setForOffer}>Offer Sell</button>
        </div>
        {#if offer}
            <div class="form-control">
                <label class="label">
                    <span class="label-text">Enter amount</span>
                </label>
                <label class="input-group">
                    <input type="text" bind:value={sellPrice} placeholder="1" class="input input-bordered">
                    <span>XRP</span>
                </label>
                
            </div>
            <button class="btn btn-primary" on:click={createSellOffer(tokenID)}>Set For Sell</button>
        {/if}
        </div>
</div>
