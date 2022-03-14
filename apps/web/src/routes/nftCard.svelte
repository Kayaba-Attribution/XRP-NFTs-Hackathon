
<script>
    export let name = 'Default Name'
    export let description = 'Defatult Description'
    export let image = './test.png'
    export let issuer = 'testaddress'
    export let tokenID = 'testID000'
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
        <button class="btn btn-primary">See More</button>
        </div>
    </div>
</div>
