
<script>
    /* import the ipfs-http-client library */
    //import { create } from 'ipfs-http-client';
    import { xrpl } from "$lib/xrp.js";
	import { secret, address } from "$lib/xrpUtils";


    //*************************************************
    //** Genereate Wallet and Fund ********************
    //*************************************************
	let input_secret=''
	const newWallet = async () => {
		//Update Stores With New Info
		secret.update(n => input_secret);
		console.log($secret)
		const wallet = xrpl.Wallet.fromSeed($secret)
		const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
        await client.connect()
        console.log("Connected to Sandbox")

		const response = await client.request({
			"command": "account_info",
			"account": wallet.classicAddress,
			"ledger_index": "validated"
		})
		let _account = response.result.account_data.Account
		address.update(n => _account);
		let _balance = response.result.account_data.Balance
		console.log(_account, _balance)
		console.log(response.result.account_data)
	}


</script>

<div class="mt-20">
	<!-- The button to open modal -->
	<label for="my-modal-4" class="btn modal-button">open modal</label>

	<!-- Put this part before </body> tag -->
	<input type="checkbox" id="my-modal-4" class="modal-toggle">
	<label for="my-modal-4" class="modal cursor-pointer">
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold">Please Enter Your Wallet Secret</h3>
		<p class="py-4">DO NOT ENTER LIVE NETWORK SECRETS!</p>
		<a class="py-4 link" href="https://xrpl.org/xrp-testnet-faucet.html">Create a testnet wallet here</a>
		<div class="flex justify-center">
			<input type="text" bind:value={input_secret} placeholder="sn3nxiW7v8KXzPzAqzyHXbSSKNuN9" class="input input-bordered input-primary w-full max-w-xs my-6">
		</div>
		<div class="flex justify-center modal-action">
			<label for="my-modal-4" class="btn btn-outline btn-success" on:click={newWallet}>Log In</label>
		</div>
	</label>
	</label>

</div>