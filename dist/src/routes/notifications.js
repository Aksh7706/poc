"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../db/db");
const helper_1 = require("../helper");
const router = express_1.default.Router();
const getNotification = joi_1.default.object({
    apiKey: joi_1.default.string().required(),
    appName: joi_1.default.string().required(),
    userWalletAddress: joi_1.default.string().required(),
});
const getInAppNotifications = async ({ body }, res) => {
    try {
        const payload = (0, helper_1.validatePayload)({ ...body }, getNotification);
        if (payload === undefined)
            return;
        const account = await (0, helper_1.accountExists)(payload.apiKey);
        const app = await (0, helper_1.appExists)(payload.appName, account.ownerAddress);
        const notifications = await db_1.db.inAppNotification.getAll(app.id, payload.userWalletAddress);
        res.status(200).send(notifications);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
router.post('/dapp/in-app', getInAppNotifications);
exports.default = router;
