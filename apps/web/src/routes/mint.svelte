

<script>
    /* import the ipfs-http-client library */
    //import { create } from 'ipfs-http-client';
    import { xrpl } from "$lib/xrp.js";
	import { secret, address, findNewTokenId } from '$lib/xrpUtils';


    let hash = '';

    // Example POST method implementation:
    const pinataApiKey = 'b5a177b8da6d89da0f9e'
    const pinataSecretApiKey = '91e7253b4c7746f3a5661f94a23affea0fb3b8ad663155c2ce1e18c99b09a3b1'

        
    const info = {
        "name": "Kayaba Test",
        "description": "XLS-20 standard for NFTs testing", 
        "issuer": "",
        "tokenID": "",
        "image": "", 
    }


    let base64Img, fileinput;
	
	const onFileSelected =(e)=>{
    let image = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                base64Img = e.target.result
                info.image = e.target.result
            };
    }

    const pinJSONToIPFS = async () => {
        let url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey
            },
            body: JSON.stringify(info)
        });
        var res = await response.json()
        hash = res.IpfsHash
        console.log(hash)
    }


    //***************************
    //** Mint Token *************
    //***************************

    //let secret = 'snc2f4ECYGbtgDggprr8DRrrvLc9v'
    //let tokenUrl = `ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi`
    let flags = 8;
    
    async function mintToken(hash) {
        let tokenUrl = `https://gateway.pinata.cloud/ipfs/${hash}`
        const wallet = xrpl.Wallet.fromSeed($secret)
        const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
        await client.connect()
        console.log("Connected to Sandbox")
    
        // Note that you must convert the token URL to a hexadecimal
        // value for this transaction.
        // ----------------------------------------------------------
        console.log("Minting NFT with url:", tokenUrl)
        const transactionBlob = {
            TransactionType: "NFTokenMint",
            Account: wallet.classicAddress,
            URI: xrpl.convertStringToHex(tokenUrl),
            Flags: parseInt(flags),
            TokenTaxon: 0 //Required, but if you have no use for it, set to zero.
        }
        //Get previous NFTS
        const Pnfts = await client.request({
            method: "account_nfts",
            account: wallet.classicAddress
        })
        console.log(Pnfts)

        // Submit signed blob --------------------------------------------------------
        const tx = await client.submitAndWait(transactionBlob,{wallet})
        console.log(tx)
    
        const nfts = await client.request({
            method: "account_nfts",
            account: wallet.classicAddress
        })
        console.log(nfts)

        let difference = []

        let latestNFT = nfts.result.account_nfts
        if(latestNFT.length == 1){
            difference.push(latestNFT[0].TokenID)
        } else{
            let previousNFTS = Pnfts.result.account_nfts
            difference = await findNewTokenId(previousNFTS, latestNFT)
        }
    
        // Check transaction results -------------------------------------------------
        if(tx.result.meta.TransactionResult === 'tesSUCCESS'){
            info.issuer = tx.result.Account
            console.log("Adding to info.indexID", difference[0])
            info.tokenID = difference[0]
            console.log("MINT SUCCESS")
            addNFT()
        }
        console.log("Balance changes:",
          JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2))
        client.disconnect()
    } //End of mintToken

    async function addNFT() {
        try {
            const response = await fetch('/api/nfts', {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(info)
            })
            var res = await response.json()
            console.log(res)
        } catch (e) {
            console.log("ERROS", e)
        }

    }

</script>

<div class="mt-20">
    <div class="text-4xl font-bold py-5 text-center">Mint Your NFT in XRPL</div>

    <div class="text-4xl font-bold py-5 text-center">Upload image</div>

    <div class="flex justify-center">
    <input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
    <div class="card w-96 bg-base-100 shadow-xl">
        <figure class="px-10 pt-10">
            {#if base64Img}
            <img class="base64Img" src="{base64Img}" alt="d" />
            {:else}
            <img class="base64Img" src="./uploadimage.gif" alt="" /> 
            {/if}
        </figure>
        <div class="card-body items-center text-center">
          <h2 class="card-title">
            {#if !base64Img}
                Upload an Image
            {:else if base64Img && (hash == '')}
                Pin to IPFS
            {:else}
                Mint NFT
            {/if}
            </h2>
          <p>Please use .jpg, .jpeg, and .png only</p>
          <div class="card-actions">
            {#if !base64Img}
            <button class="btn btn-primary" on:click={()=>{fileinput.click();}}>Upload</button>
            {:else}
            <button class="btn btn-primary" on:click={()=>{pinJSONToIPFS(info)}} disabled={hash !== ''}>Save to IPFS</button>
            {/if}
            
        </div>
        {#if hash}
            <a href="https://gateway.pinata.cloud/ipfs/{hash}" class="link">IPFS Gateway to CID</a>
            <label class="label">
                <span class="label-text">Your NFT name</span>
            </label>
            <input bind:value={info.name} type="text" placeholder="XRP-Hackathon Mage" class="input input-bordered input-success w-full max-w-xs">
            <label class="label">
                <span class="label-text">Your NFT Description</span>
            </label>
            <input bind:value={info.description} type="text" placeholder="This NFT represents..." class="input input-bordered input-success w-full max-w-xs">
            <button class="btn btn-primary my-3" on:click={mintToken(hash)}>Mint XLS-20 NFT</button>
        {/if}
        </div>
    </div>
    </div>


</div>