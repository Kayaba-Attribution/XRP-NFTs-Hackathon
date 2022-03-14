import { writable } from "svelte/store";

export const secret = writable('sna9D6XZr2T2ZgKTTWFYCuycfCWrX')
export const address = writable('')
export const balance = writable('0')

export function findNewTokenId(before, after){
    let _before = []
    let _after = []

    console.log(before)
    console.log(after)

    for (let i = 0; i < after.length; i++) {
        _after.push(after[i].TokenID)
        if(i < before.length){
            _before.push(before[i].NonFungibleToken.TokenID)
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

