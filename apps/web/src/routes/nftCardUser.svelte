
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
        <button class="btn btn-primary">See More</button>
        </div>
    </div>
</div>
