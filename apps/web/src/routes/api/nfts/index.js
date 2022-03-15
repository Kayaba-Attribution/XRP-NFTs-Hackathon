import clientPromise from "$lib/db";
import dotenv from 'dotenv';
dotenv.config();

let collectionName = 'nfts-pro'
if (process.env['NODE_ENV'] === 'development'){
    collectionName = 'nfts-local'
}



export async function get(request) { 
    const dbConnection = await clientPromise;
    const db = dbConnection.db();
    const collection = db.collection(collectionName);
    const all = await collection.find().toArray()
    console.log(all[0])
    console.log(process.env['NODE_ENV'])

  return {
    status: 200,
    body: all
  };
}

export async function post({request}) { 
    try {

        const dbConnection = await clientPromise;
        const db = dbConnection.db();
        const collection = db.collection(collectionName);
        console.log("CONECTED")
        
        const nft = await request.json()
        await collection.insertOne(nft)

        return {
            status: 200,
            body: {
                status: 'Success'
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
 