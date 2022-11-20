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
}
exports.Pigeon = Pigeon;
