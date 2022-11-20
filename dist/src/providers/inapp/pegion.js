"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pigeon = void 0;
const db_1 = require("../../db/db");
class Pigeon {
    async sendMessage(args) {
        const { user, app, data } = args;
        await db_1.db.inAppNotification.create({
            appId: app.id,
            isRead: false,
            message: data.message,
            userWalletAdress: user.walletAddress,
        });
    }
    async sendWelcomeMessage(app, walletAddress) {
        const message = `Thanks for subscribing at ${app.name}.\n We will be sending your on-chain and product notifications here.`;
        await db_1.db.inAppNotification
            .create({
            appId: app.id,
            isRead: false,
            message: message,
            userWalletAdress: walletAddress,
        })
            .catch((e) => { });
    }
}
exports.Pigeon = Pigeon;
