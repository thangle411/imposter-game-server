import express from 'express';
import { getSeenWords, updateSeenWords } from '../controllers/seenWordsControllers';
import { appwriteAuth } from '../middlewares/appwriteAuth';

const router = express.Router();

router.get('/', appwriteAuth, getSeenWords);
router.post('/', appwriteAuth, updateSeenWords);

export default router;