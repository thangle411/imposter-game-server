"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_appwrite_1 = require("node-appwrite");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createAppWriteClient = async (jwt) => {
    const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } = process.env;
    if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_API_KEY) {
        throw new Error("Appwrite environment variables not found");
    }
    const client = new node_appwrite_1.Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setJWT(jwt);
    return {
        account: new node_appwrite_1.Account(client),
        tablesDB: new node_appwrite_1.TablesDB(client)
    };
};
exports.default = createAppWriteClient;
