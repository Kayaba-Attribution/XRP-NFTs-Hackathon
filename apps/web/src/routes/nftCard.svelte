
<script>
    export let name = 'Default Name'
    export let description = 'Defatult Description'
    export let image = './test.png'
    export let issuer = 'testaddress'
    export let tokenID = 'testID000'

    import { xrpl } from "$lib/xrp.js";
	import { secret, address, findNewTokenId } from '$lib/xrpUtils';


    //********************************
    //** Create Buy Offer ***********
    //********************************

    async function createBuyOffer(_tokenID) {

    const wallet = xrpl.Wallet.fromSeed($secret)
    const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
    await client.connect()
    console.log("Connected to Sandbox")

    // Prepare transaction -------------------------------------------------------
    const transactionBlob = {
        "TransactionType": "NFTokenCreateOffer",
        "Account": wallet.classicAddress,
        "Owner": owner.value,
        "TokenID": _tokenID,
        "Amount": amount.value,
        "Flags": parseInt(0)
    }

    // Submit signed blob --------------------------------------------------------
    const tx = await client.submitAndWait(transactionBlob,{wallet})

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
    // End of createBuyOffer()  
    }


    //***************************
    //** Get Offers *************
    //***************************

    async function getOffers(_tokenID) {

    const wallet = xrpl.Wallet.fromSeed($secret)
    const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
    await client.connect()
    console.log("Connected to Sandbox")
    console.log("***Sell Offers***\n", _tokenID)
    let nftSellOffers
    try {
        nftSellOffers = await client.request({
        method: "nft_sell_offers",
        tokenid: _tokenID
    })
    } catch (err) {
        console.log("No sell offers.", err)
    }
    console.log(JSON.stringify(nftSellOffers,null,2))
    console.log("***Buy Offers***")
    let nftBuyOffers
    try {
    nftBuyOffers = await client.request({
        method: "nft_buy_offers",
    tokenid: _tokenID })
    } catch (err) {
    console.log("No buy offers.", err)
    }
    console.log(JSON.stringify(nftBuyOffers,null,2))
    client.disconnect()
    // End of getOffers()
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
        <button class="btn btn-primary" on:click={() => getOffers(tokenID)}>See Offers</button>
        </div>
    </div>
</div>
