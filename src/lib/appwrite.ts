import { Client, Account, TablesDB } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const createAppWriteClient = async (jwt: string) => {
    const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } = process.env;

    if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
        throw new Error("Appwrite environment variables not found");
    }

    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setJWT(jwt);

    return {
        account: new Account(client),
        tablesDB: new TablesDB(client)
    }
}

export default createAppWriteClient;