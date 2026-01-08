"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const seenWordsControllers_1 = require("../controllers/seenWordsControllers");
const appwriteAuth_1 = require("../middlewares/appwriteAuth");
const router = express_1.default.Router();
router.get('/', appwriteAuth_1.appwriteAuth, seenWordsControllers_1.getSeenWords);
router.post('/', appwriteAuth_1.appwriteAuth, seenWordsControllers_1.updateSeenWords);
exports.default = router;
