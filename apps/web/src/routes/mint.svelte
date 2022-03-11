

<script>

    import { xrpl } from "$lib/xrp.js";

    //***************************
    //** Mint Token *************
    //***************************

    var secret = 'snc2f4ECYGbtgDggprr8DRrrvLc9v'
    var tokenUrl = 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi'
    var flags = 8;
    
    async function mintToken() {
        const wallet = xrpl.Wallet.fromSeed(secret)
        const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
        await client.connect()
        console.log("Connected to Sandbox")
    
        // Note that you must convert the token URL to a hexadecimal
        // value for this transaction.
        // ----------------------------------------------------------
        const transactionBlob = {
            TransactionType: "NFTokenMint",
            Account: wallet.classicAddress,
            URI: xrpl.convertStringToHex(tokenUrl),
            Flags: parseInt(flags),
            TokenTaxon: 0 //Required, but if you have no use for it, set to zero.
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
    } //End of mintToken
</script>

<div class="mt-20">
    <div class="text-4xl font-bold py-5 text-center">Mint Your NFT in XRPL</div>

    <div class="card w-96 bg-base-100 shadow-xl">
        <figure class="px-10 pt-10">
          <img src="https://api.lorem.space/image/shoes?w=400&h=225" alt="Shoes" class="rounded-xl">
        </figure>
        <div class="card-body items-center text-center">
          <h2 class="card-title">Mint An NFT!</h2>
          <p>If a dog chews shoes whose shoes does he choose?</p>
          <div class="card-actions">
            <button class="btn btn-primary" on:click={mintToken}>Buy Now</button>
          </div>
        </div>
      </div>
</div>