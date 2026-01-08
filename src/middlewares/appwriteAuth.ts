import { Request, Response } from "express";
import createAppWriteClient from "../lib/appwrite";

export const appwriteAuth = async (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }

    const jwt = authHeader.split("Bearer ")[1];

    try {
        const { account } = await createAppWriteClient(jwt);
        const user = await account.get();

        req.appwriteUser = {
            user,
            jwt
        };

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}