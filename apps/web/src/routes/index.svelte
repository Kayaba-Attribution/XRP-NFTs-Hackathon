<script>
	import { secret, address, findNewTokenId } from '$lib/xrpUtils';
    import { onMount } from 'svelte';
    import Typewriter from 'svelte-typewriter'
    let savedSecret;
    onMount(() => {
        //localStorage.setItem("secret", "sp54EtKddM7gRQxcY9ienDTXxM9QL")
        savedSecret = localStorage.getItem("secret")
    })

    
</script>

<div class="mt-20">

    <!-- <h2>HI {savedSecret}</h2>
    <h2>Secret {$secret}</h2> -->
    {#if !$secret}
        <div class="alert alert-error shadow-lg">
        <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>You are not logged in! Please connect (button is in navabar)</span>
        </div>
    </div>
    {/if}

    <div class="flex flex-col w-full lg:flex-row my-12">
        <div class="grid flex-grow md:my-10 md:w-80 card rounded-box place-items-left md:mr-3">
            <div class="text-5xl md:text-7xl font-extrabold text-center md:text-left py-3"> XRPL NFT
                <div class="text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-600">
                    <Typewriter loop>
                        <p>Generator</p>
                        <p>Manager</p>
                        <p>Market</p>
                    </Typewriter>
                </div>
            </div>
            <div class="py-4 text-2xl font-bold text-center md:text-left"> The easy, no-code, and convenient way to create, manage, and trade your XLS-20 NFTs in XRPL</div>
            <div class="flex justify-center md:justify-start py-2">
                    <a href="/mint" class="btn btn-primary">
                        Mint Your Own NFT!!
                    </a>
                    <a href="/nfts" class="btn btn-primary ml-3" >
                       See All NFTs
                    </a>
            </div>
        </div> 
        <div class="grid flex-grow md:w-1/3 card rounded-box place-items-center">
            <img src="./indeximg.gif" alt="Shoes">
        </div>

        
    </div>


    <div class="flex justify-center py-5 w-full">    
        <ul class="steps">
            <li class="step step-primary">Upload Image</li>
            <li class="step step-primary">Save To IPFS</li>
            <li class="step step-primary">Create Sell & Buy Orders</li>
            <li class="step step-primary">Accept or Cancel Offers</li>
            <li class="step step-primary">Discover All NFTS</li>
        </ul>
    </div>

    <div class="flex justify-center py-5">
        <a href="/mynfts" class="btn btn-primary ml-3" >
            See Your NFTs
        </a>
    </div>

    
</div>

