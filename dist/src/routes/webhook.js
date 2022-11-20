"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const base64_1 = require("../utils/base64");
const router = express_1.default.Router();
router.post('/webhook/:appId/:providerName', async ({ params, body }, res) => {
    const appId = params.appId;
    const providerName = params.providerName;
    if (!appId || !providerName)
        return res.sendStatus(200);
    const app = await db_1.db.app.getById(appId);
    const provider = await db_1.db.provider.get(appId, providerName);
    if (!app || !provider)
        return res.sendStatus(200); // if app or provider does not exist
    if (provider.providerKey !== 'TELEGRAM')
        return res.sendStatus(200); // TODO: Make hook more generalized
    const message = body?.message?.text ?? '';
    const msgArray = message.split(' ');
    const chatId = body?.message?.chat?.id;
    if (msgArray.length === 2 && msgArray[0] === '/start' && chatId) {
        const encodedWalletAddress = msgArray[1]; // TODO: add method to validate isWalletAddress
        if (!encodedWalletAddress)
            return res.sendStatus(200);
        try {
            const walletAddress = base64_1.Base64.decode(encodedWalletAddress);
            let user = await db_1.db.user.get(appId, walletAddress);
            if (!user) {
                user = await db_1.db.user.create(appId, {
                    walletAddress: walletAddress,
                    telegramData: {
                        create: {
                            chatId: chatId.toString(),
                            providerName: providerName,
                        },
                    },
                });
            }
            else {
                user = await db_1.db.user.updateTelegramChatId(appId, walletAddress, providerName, chatId.toString());
            }
            console.log('User : ', user);
        }
        catch (e) { }
    }
    return res.sendStatus(200);
});
exports.default = router;
