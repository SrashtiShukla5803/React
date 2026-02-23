import { Client, Databases, ID, Query } from 'appwrite'

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT

//console.log(PROJECT_ID,DATABASE_ID,COLLECTION_ID)
const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID)

const database = new Databases(client)

export const updateSearchCount = async (searchTerm, movie) =>{
    // 1. to use appwrite sdk to check if the serach term exists in the DB
    try{
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal('searchTerm', searchTerm)]
        )
        
        //2.
        if(result.documents.length > 0){
            const doc = result.documents[0];

            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                doc.$id,
                {
                    count : doc.count + 1
                }
            )
        }
        //3.
        else{
        await database.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
            searchTerm,
            count:1,
            movie_id:movie.id,
            poster_url: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : ""
        }
    )
}
    }catch(error){
        console.error(error)
    }
    // 2. if it does, update the count
    // 3. if it doesn't, create a new document with the search term count as 1
}

export const getTrendingMovies = async ()=>{
    try{
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.limit(5),
                Query.orderDesc("count"),
            ]
        )

        return result.documents;

    }catch(error){
        console.log(error);
        return [];
    }
}