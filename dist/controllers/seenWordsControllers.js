"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeenWords = exports.getSeenWords = void 0;
const node_appwrite_1 = require("node-appwrite");
const appwrite_1 = __importDefault(require("../lib/appwrite"));
const DATABASE_ID = "695e2dcb002d88748868";
const COLLECTION_ID = "seen_words";
const getSeenWords = async (req, res) => {
    if (!req.appwriteUser) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { tablesDB } = await (0, appwrite_1.default)(req.appwriteUser?.jwt);
    try {
        const existing = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: COLLECTION_ID,
            queries: [node_appwrite_1.Query.equal("user_id", req.appwriteUser.user.$id)]
        });
        console.log('existing', existing);
        if (existing.rows.length === 0) {
            return res.json({
                success: true,
                words: [],
            });
        }
        const row = existing.rows[0];
        return res.json({
            success: true,
            words: row.word_id,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get seen words" });
    }
};
exports.getSeenWords = getSeenWords;
const updateSeenWords = async (req, res) => {
    if (!req.appwriteUser) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { word_ids } = req.body;
    console.log('words', word_ids);
    if (!word_ids || !Array.isArray(word_ids)) {
        return res.status(400).json({ message: 'No word IDs provided' });
    }
    const normalized = word_ids
        .map(Number)
        .filter((n) => Number.isInteger(n));
    console.log('normalized', normalized);
    // array must contain some values, because frontend will not send empty array
    if (normalized.length === 0) {
        return res.status(400).json({ error: "No valid word_id values" });
    }
    const { tablesDB } = await (0, appwrite_1.default)(req.appwriteUser?.jwt);
    try {
        const existing = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: COLLECTION_ID,
            queries: [node_appwrite_1.Query.equal("user_id", req.appwriteUser.user.$id)]
        });
        console.log('existing', existing);
        if (existing.rows.length === 0) {
            const result = await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: COLLECTION_ID,
                rowId: node_appwrite_1.ID.unique(),
                data: {
                    "user_id": req.appwriteUser.user.$id,
                    "word_id": normalized,
                },
            });
            console.log('result', result);
            return res.json({
                success: true,
                words: result.word_id,
            });
        }
        // merge + dedupe
        const row = existing.rows[0];
        const merged = Array.from(new Set([...(row.word_id ?? []), ...normalized]));
        console.log('merged', merged);
        const result = await tablesDB.updateRow({
            databaseId: DATABASE_ID,
            tableId: COLLECTION_ID,
            rowId: row.$id,
            data: {
                "word_id": merged,
            },
        });
        console.log('result', result);
        res.json({
            success: true,
            words: result.word_id,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update seen words" });
    }
};
exports.updateSeenWords = updateSeenWords;
