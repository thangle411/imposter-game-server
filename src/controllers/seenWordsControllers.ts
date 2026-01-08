import { Request, Response } from 'express';
import { ID, Query } from "node-appwrite";
import createAppWriteClient from '../lib/appwrite';

const DATABASE_ID = "695e2dcb002d88748868";
const COLLECTION_ID = "seen_words";

export const getSeenWords = async (req: Request, res: Response) => {
    if (!req.appwriteUser) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { tablesDB } = await createAppWriteClient(req.appwriteUser?.jwt);

    try {
        const existing = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: COLLECTION_ID,
            queries: [Query.equal("user_id", req.appwriteUser.user.$id)]
        });

        console.log('existing', existing)

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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get seen words" });
    }
}

export const updateSeenWords = async (req: Request, res: Response) => {
    if (!req.appwriteUser) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { word_ids } = req.body;

    console.log('words', word_ids)

    if (!word_ids || !Array.isArray(word_ids)) {
        return res.status(400).json({ message: 'No word IDs provided' });
    }

    const normalized = word_ids
        .map(Number)
        .filter((n: number) => Number.isInteger(n));

    console.log('normalized', normalized)

    // array must contain some values, because frontend will not send empty array
    if (normalized.length === 0) {
        return res.status(400).json({ error: "No valid word_id values" });
    }

    const { tablesDB } = await createAppWriteClient(req.appwriteUser?.jwt);

    try {
        const existing = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: COLLECTION_ID,
            queries: [Query.equal("user_id", req.appwriteUser.user.$id)]
        });

        console.log('existing', existing)

        if (existing.rows.length === 0) {
            const result = await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: COLLECTION_ID,
                rowId: ID.unique(),
                data: {
                    "user_id": req.appwriteUser.user.$id,
                    "word_id": normalized,
                },
            });

            console.log('result', result)

            return res.json({
                success: true,
                words: result.word_id,
            });
        }

        // merge + dedupe
        const row = existing.rows[0];
        const merged = Array.from(
            new Set([...(row.word_id ?? []), ...normalized])
        );

        console.log('merged', merged)

        const result = await tablesDB.updateRow({
            databaseId: DATABASE_ID,
            tableId: COLLECTION_ID,
            rowId: row.$id,
            data: {
                "word_id": merged,
            },
        });

        console.log('result', result)

        res.json({
            success: true,
            words: result.word_id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update seen words" });
    }

}