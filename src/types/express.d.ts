
import { Request } from 'express';
import { Models } from 'node-appwrite';

declare global {
    namespace Express {
        interface Request {
            appwriteUser?: {
                user: Models.User<Models.Preferences>,
                jwt: string
            }
        }
    }
}
