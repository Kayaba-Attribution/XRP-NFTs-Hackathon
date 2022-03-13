

<script>
    /* import the ipfs-http-client library */
    //import { create } from 'ipfs-http-client';
    import { xrpl } from "$lib/xrp.js";

    // Example POST method implementation:
    const pinataApiKey = 'b5a177b8da6d89da0f9e'
    const pinataSecretApiKey = '91e7253b4c7746f3a5661f94a23affea0fb3b8ad663155c2ce1e18c99b09a3b1'

        
    const info = JSON.stringify(
        {
            "name": "test"
        }
    )

    const pinJSONToIPFSwithFetch = async (JSONBody) => {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        console.log(JSONBody)
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json',
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            },
            body: JSONBody
        });
      console.log(response.json())
      //return response.json(); // parses JSON response into native JavaScript objects
    }

    async function pinFileToIPFS(img) {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        // see base64 img
        console.log(img)
        // create data from
        let data = new FormData();
        // add base64 img
        data.append('file', img);

        //metadata is optional
        const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
        });
        data.append('pinataMetadata', metadata);


        const response = await fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            },
            body: data // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

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


    let  avatar, fileinput;
	
	const onFileSelected =(e)=>{
    let image = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                 avatar = e.target.result
            };
    }
</script>

<div class="mt-20">
    <div class="text-4xl font-bold py-5 text-center">Mint Your NFT in XRPL</div>

    <div class="text-4xl font-bold py-5 text-center">Upload image</div>


    <input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
    <div class="card w-96 bg-base-100 shadow-xl">
        <figure class="px-10 pt-10">
            {#if avatar}
            <img class="avatar" src="{avatar}" alt="d" />
            {:else}
            <img class="avatar" src="./uploadimage.gif" alt="" /> 
            {/if}
        </figure>
        <div class="card-body items-center text-center">
          <h2 class="card-title">Upload an Image</h2>
          <p>Please use .jpg, .jpeg, and .png only</p>
          <div class="card-actions">
            {#if !avatar}
            <button class="btn btn-primary" on:click={()=>{fileinput.click();}}>Upload</button>
            {:else}
            <!-- <button class="btn btn-primary" on:click={()=>{pinFileToIPFS(avatar)}}>Save to IPFS</button> -->
            <button class="btn btn-primary" on:click={()=>{pinJSONToIPFSwithFetch(info)}}>Save to IPFS</button>

            {/if}
            
          </div>
        </div>
    </div>


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