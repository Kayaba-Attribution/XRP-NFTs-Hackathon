import { writable } from "svelte/store";
import { xrpl } from "$lib/xrp.js";
//sp54EtKddM7gRQxcY9ienDTXxM9QL
export const secret = writable('')
export const address = writable('')
export const balance = writable('0')
export const nativeBalanceUSD = writable('0')

export async function loadSecretFromLocal(){
    if(localStorage.getItem("secret")){
        await addWallet(localStorage.getItem("secret"))
    } else{
        console.log("No Secret in Storage")
    }
}

export async function saveSecretLocal(_val){
    try {
        localStorage.setItem("secret", _val)
    } catch (e) {
        console.log("Error on secret save", e)
    }
}

export async function addWallet(input_secret){
    const wallet = xrpl.Wallet.fromSeed(input_secret)
    const client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233")
    await client.connect()
    console.log("Connected to Sandbox")

    const response = await client.request({
        "command": "account_info",
        "account": wallet.classicAddress,
        "ledger_index": "validated"
    })
    //save secret localStorage
    saveSecretLocal(input_secret)
    //Update Stores With New Info
	secret.update(n => input_secret);
    // save accout 
    let _account = response.result.account_data.Account
    address.update(n => _account);
    // save balance 
    let _balance = response.result.account_data.Balance
    balance.update(n => _balance);
    // save nativeBalanceUSD 
    let _nativeBalanceUSD = Number(_balance)/10**7 * (await spotUSD("XRP")) + " USD"
    nativeBalanceUSD.update(n => _nativeBalanceUSD)

}
export async function findNewTokenId(before, after){
    let _before = []
    let _after = []

    console.log(before)
    console.log(after)

    for (let i = 0; i < after.length; i++) {
        _after.push(after[i].TokenID)
        if(i < before.length){
            _before.push(before[i].TokenID)
        }
    }

    let difference = _after.filter(x => !_before.includes(x));

    console.log("New Token ID:", difference)
    return difference
}


export async function spotUSD(_symbol){
    let response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol='+_symbol +'USDT');
    response = await response.json();
    let price = Number(response.price).toFixed(2)
    console.log(`💲 ${_symbol} to USD: ${price} USD 💲`)
    return price
}

export async function spotMTR(){
    let response = await fetch('https://api.coingecko.com/api/v3/coins/meter-stable');
    response = await response.json();
    let price = Number(response.market_data.current_price.usd).toFixed(2)
    console.log(`💲 MTR to USD: ${price} USD 💲`)
    return price
}

export function formatDate(timestamp){
    return new Date(timestamp * 1000).toLocaleString([],{year: 'numeric', month: 'numeric', day: 'numeric'})
}

