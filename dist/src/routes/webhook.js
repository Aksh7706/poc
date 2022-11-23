"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const telegram_1 = require("../providers/other/telegram");
const reddis_1 = require("../reddis");
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
    const telegramProvider = new telegram_1.Telegram();
    if (msgArray.length === 2 && msgArray[0] === '/start' && chatId) {
        const welcomeMessage = `Thanks for subscribing at ${app.name}.\n We will be sending your on-chain and product notifications here.`;
        const failedMessage = `Oops! Login attempt failed. Please try again.`;
        const otp = msgArray[1]; // TODO: add method to validate isWalletAddress
        if (!otp)
            return res.sendStatus(200);
        try {
            const walletAddress = await reddis_1.RedisHelper.getWalletFromOTP(otp);
            if (!walletAddress) {
                await telegramProvider.sendDirectMessage(provider, chatId.toString(), failedMessage);
                return res.sendStatus(200);
            }
            await reddis_1.RedisHelper.deleteOTP(otp);
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
            await telegramProvider.sendDirectMessage(provider, chatId.toString(), welcomeMessage);
            console.log('User : ', user);
        }
        catch (e) {
            console.log('Error telegram : ', e);
        }
    }
    return res.sendStatus(200);
});
exports.default = router;
