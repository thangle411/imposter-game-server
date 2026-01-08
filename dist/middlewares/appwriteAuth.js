"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appwriteAuth = void 0;
const appwrite_1 = __importDefault(require("../lib/appwrite"));
const appwriteAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }
    const jwt = authHeader.split("Bearer ")[1];
    try {
        const { account } = await (0, appwrite_1.default)(jwt);
        const user = await account.get();
        req.appwriteUser = {
            user,
            jwt
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
exports.appwriteAuth = appwriteAuth;
