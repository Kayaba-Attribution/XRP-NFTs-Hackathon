import clientPromise from "$lib/db";

export async function get(request) { 
    const dbConnection = await clientPromise;
    const db = dbConnection.db();
    const collection = db.collection('nfts-tc');
    const all = await collection.find().toArray()

  return {
    status: 200,
    body: all
  };
}

export async function post({request}) { 
    try {

        const dbConnection = await clientPromise;
        const db = dbConnection.db();
        const collection = db.collection('nfts-tc');
        console.log("CONECTED")
        
        const nft = await request.json()
        await collection.insertOne(nft)

        return {
            status: 200,
            body: {
                error: 'Success'
            }
        }
    } catch (error) {
        return {
            status: 500,
            body: {
                error: 'SERVER ERROR'
            }
        }
    }

  }
 