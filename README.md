<p align="center">
  <h1 align="center">🏗️⚡ XRPL NFT Generator and MarketPlace ⚡🏗️</h1>
  <h3 align="center">This is my entry for the XRPL Hackathon: New Year, New NFTs Hackathon
</h3>
  <h3 align="center">The easy, no-code, and convenient way to create your own and trade XLS-20 NFTs in XRPL
</h3>

### Inspiration

Following the tutorial I found 3 big problems:

+ For a non developer create a NFT on XRP is hard
+ The example tutorial uses a url, not a image with metadata
+ Lots of parameters needed to be known by user

### What it does

The easy, no-code, and convenient way to create your own XLS-20 NFT in XRPL

+ Simple, Easy To use UI
+ Upload Custom Images and descriptions, Images are added to IPFS via Pinanta
+ No Configuration, Create Buy and Sell Orders, Manage your NFTs, and trade the on the market

### How I built it

SvelteKit for FrontEnd, MongoDB for keeping track of NFTs minted on the app and used NFToken Tester Tutorial to integrate the XRP NFT token standard functions

### Challenges we ran into

+ Lots of variables needed to create and manage offers, and some minor challenges by being the first time I used xrp ledger, coming from a EVM background
+ Wallet Secret Handling
+ NFTs ID search

### What's next for XRPL NFT Generator and MarketPlace

Deploy live and allow anyone to create their own NFT in XRP Other than that Polish, and Monetize the Marketplace


</p>

# What's inside?

This is a [Turborepo](https://turborepo.org/) with parallel execution, that contains a [Svelte-kit](https://kit.svelte.dev/) app and [daisyui](https://daisyui.com/) for front-end, this repo was refactored to work with XRPL ledger.

+ Svelte unlike React or Vue that do the bulk work on the browser, compiles your app on build.
+ Svelte $reactivity triggers efficient, granular updates by assigning to local variables.  

### Apps

- `web`: Svelte-kit website with XRPL integration in progress.
