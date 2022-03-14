
<script>


    export let name = 'Default Name'
    export let description = 'Defatult Description'
    export let image = './test.png'
    export let issuer = 'testaddress'
    export let tokenID = 'testID000'
    export let owner = false

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


    //***************************
    //** Get Offers *************
    //***************************

    async function getOffers(_tokenID) {

        const wallet = xrpl.Wallet.fromSeed($secret)
        const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
        await client.connect()
        console.log("Connected to Sandbox")
        console.log("***Sell Offers***\nForID: ", _tokenID)
        let nftSellOffers
        try {
            nftSellOffers = await client.request({
            method: "nft_sell_offers",
            tokenid: _tokenID
        })
        sellOffers = nftSellOffers.result.offers
        console.log("Sell Offers:", nftSellOffers.result.offers)
        } catch (err) {
            console.log("No sell offers.", err)
        }
        //console.log(JSON.stringify(nftSellOffers,null,2))
        console.log("***Buy Offers***")
        let nftBuyOffers
        try {
        nftBuyOffers = await client.request({
            method: "nft_buy_offers",
        tokenid: _tokenID })
        buyOffers = nftBuyOffers.result.offers
        console.log("buyOffers Offers:", nftBuyOffers.result.offers)
        } catch (err) {
        console.log("No buy offers.", err)
        }
        console.log(JSON.stringify(nftBuyOffers,null,2))
        client.disconnect()
        // End of getOffers()
        setToSeeOffers()
    }

    //***************************
    //** Accept Sell Offer ******
    //***************************

    async function acceptSellOffer(_tokenOfferIndex) {

        const wallet = xrpl.Wallet.fromSeed($secret)
        const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
        await client.connect()
        console.log("Connected to Sandbox")

        // Prepare transaction -------------------------------------------------------
        const transactionBlob = {
            "TransactionType": "NFTokenAcceptOffer",
            "Account": wallet.classicAddress,
            "SellOffer": _tokenOfferIndex,
        }
        // Submit signed blob --------------------------------------------------------
        const tx = await client.submitAndWait(transactionBlob,{wallet})
        const nfts = await client.request({
        method: "account_nfts",
        account: wallet.classicAddress
        })
        console.log(JSON.stringify(nfts,null,2))

        // Check transaction results -------------------------------------------------
        console.log("Transaction result:",
        JSON.stringify(tx.result.meta.TransactionResult, null, 2))
        console.log("Balance changes:",
        JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
        client.disconnect()
        // End of acceptSellOffer()
    }
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
                tokenid: _tokenId
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
            tokenid: _tokenId })
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
        setForOffer()
        // End of createSellOffer()
        }


    //********************************
    //** Create Buy Offer ***********
    //********************************
    let sellPrice;
    async function createBuyOffer(_tokenId, issuer) {

        const wallet = xrpl.Wallet.fromSeed($secret)
        const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
        await client.connect()
        console.log("Connected to Sandbox")

        // Prepare transaction -------------------------------------------------------
        const transactionBlob = {
            "TransactionType": "NFTokenCreateOffer",
            "Account": wallet.classicAddress,
            "Owner": issuer,
            "TokenID": _tokenId,
            "Amount": String(sellPrice * 10**6),
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
    //** Cancel Offer ***********
    //***************************

    async function cancelOffer(_tokenOfferIndex) {

    const wallet = xrpl.Wallet.fromSeed($secret)
    const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
    await client.connect()
    console.log("Connected to Sandbox")

    const tokenID = _tokenOfferIndex
    const tokenIDs = [tokenID]

    // Prepare transaction -------------------------------------------------------
    const transactionBlob = {
        "TransactionType": "NFTokenCancelOffer",
        "Account": wallet.classicAddress,
        "TokenIDs": tokenIDs
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
    // End of cancelOffer()
    }

    //***************************
    //** Accept Buy Offer ******
    //***************************

     async function acceptBuyOffer(_tokenOfferIndex) {

        const wallet = xrpl.Wallet.fromSeed($secret)
        const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
        await client.connect()
        console.log("Connected to Sandbox")

        // Prepare transaction -------------------------------------------------------
        const transactionBlob = {
            "TransactionType": "NFTokenAcceptOffer",
            "Account": wallet.classicAddress,
            "BuyOffer": _tokenOfferIndex
        }
        // Submit signed blob --------------------------------------------------------
        const tx = await client.submitAndWait(transactionBlob,{wallet})
        const nfts = await client.request({
        method: "account_nfts",
        account: wallet.classicAddress
        })
        console.log(JSON.stringify(nfts,null,2))

        // Check transaction results -------------------------------------------------
        console.log("Transaction result:",
        JSON.stringify(tx.result.meta.TransactionResult, null, 2))
        console.log("Balance changes:",
        JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
        client.disconnect()
        // End of submitTransaction()
    }

    let sellOffers = []
    let buyOffers = []


    let seeOffers = false;
    function setToSeeOffers(){
        seeOffers = !seeOffers
    }

    let offer = false;
    function setForOffer(){
        offer = !offer
    }
</script>


<div class="card w-80 bg-base-100 shadow-xl hover:bg-base-200 ">
    <figure class="px-5 py-5 bg-slate-600">
        <img src={image} alt="Shoes" class="rounded-xl w-full" />
    </figure>
    <div class="card-body items-center text-center">
        <h2 class="card-title">{name}</h2>
        <p>{description}</p>
        <p class="my-2">Owner:</p>
        <div class="badge badge-outline badge-sm">{owner ? "You": issuer}</div>
        <p class="my-2">Token ID:</p>
        <div class="badge badge-outline badge-sm text-xs">{tokenID.slice(0, 16)}...{tokenID.slice(-16)}</div>
        {#if owner}
             <!-- content here -->
             <button class="btn btn-outline btn-error mt-5" on:click={() => burnToken(tokenID)}>Burn NFT</button>
        {/if}
        <div class="card-actions">
        <button class="btn btn-outline btn-info" on:click={() => getOffers(tokenID)}>{seeOffers ? "See Offers" : "See Offers"}</button>
        <button class="btn btn-outline btn-success" on:click={setForOffer}>SET OFFER</button>
    </div>
        {#if seeOffers}
            {#each sellOffers as sellO, i}
                <div class="stats shadow">
    
                    <div class="stat">
                    <div class="stat-title">Sell Offer Amount</div>
                    <div class="stat-value">{sellO.amount/10**6} XRP</div>
                    <div class="stat-desc">By: {sellO.owner.slice(0, 6)}...{sellO.owner.slice(-6)}</div>
                    </div>
                </div>
                {#if owner}
                    <button on:click={() => cancelOffer(sellO.index)} class="btn btn-error">Cancel Sell for {sellO.amount/10**6} XRP </button>
                {:else}
                    <button on:click={() => acceptSellOffer(sellO.index)} class="btn btn-success">Buy NFT for {sellO.amount/10**6} XRP </button>
                {/if}
            {/each}
            {#each buyOffers as buyO, i}
            <div class="stats shadow">

                <div class="stat">
                <div class="stat-title">Buy Offer Amount</div>
                <div class="stat-value">{buyO.amount/10**6} XRP</div>
                <div class="stat-desc">By: {buyO.owner.slice(0, 6)}...{buyO.owner.slice(-6)}</div>
                </div>
            </div>
            {#if owner}
            <button on:click={() => acceptBuyOffer(buyO.index)} class="btn btn-success">Accept Offer of {buyO.amount/10**6} XRP </button>
            {:else}
            <button on:click={() => cancelOffer(buyO.index)} class="btn btn-error">Cancel Sell for {buyO.amount/10**6} XRP </button>
            {/if}
        {/each}
        {/if}
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
            {#if owner}
                <button class="btn btn-primary my-5" on:click={createSellOffer(tokenID)}>Create Sell Offer</button>
            {:else}
                <button class="btn btn-primary my-5" on:click={createBuyOffer(tokenID, issuer)}>Create Buy Offer</button>
            {/if}
        {/if}
    </div>
</div>
