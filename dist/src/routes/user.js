"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const helper_1 = require("../helper");
const authValidation_1 = require("../middleware/authValidation");
const pegion_1 = require("../providers/inapp/pegion");
const base64_1 = require("../utils/base64");
const router = express_1.default.Router();
const getAllUsers = async ({ body, ownerAddress }, res) => {
    if (!body.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = await (0, helper_1.appExists)(body.appName, ownerAddress);
        const user = await db_1.db.user.getAll(app.id);
        return res.status(200).send(user);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const getUser = async ({ body, ownerAddress }, res) => {
    if (!body.appName || !body.walletAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = await (0, helper_1.appExists)(body.appName, ownerAddress);
        const user = await db_1.db.user.get(app.id, body.walletAddress);
        return res.status(200).send(user);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const upsertUser = async ({ body, ownerAddress }, res) => {
    if (!body.appName || !body.walletAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = await (0, helper_1.appExists)(body.appName, ownerAddress);
        const userCheck = await db_1.db.user.get(app.id, ownerAddress);
        const user = await db_1.db.user.update(app.id, body.walletAddress, {
            email: body.email,
            mobile: body.mobile,
        });
        if (!userCheck) {
            const pegionProvider = new pegion_1.Pigeon();
            await pegionProvider.sendWelcomeMessage(app, body.walletAddress);
        }
        return res.status(200).send(user);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const getTelegramInvite = async ({ body }, res) => {
    //https://telegram.me/Staging00Bot?start=aksh=jj__w--xj=hhb==
    if (!body.botUserName || !body.walletAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const inviteLink = `https://telegram.me/${body.botUserName}?start=${base64_1.Base64.encode(body.walletAddress)}`;
        return res.status(200).send({
            url: inviteLink,
        });
    }
    catch (e) {
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    }
};
router.post('/get', authValidation_1.omniAuthValidation, getUser);
router.post('/getAll', authValidation_1.omniAuthValidation, getAllUsers);
router.post('/upsert', authValidation_1.omniAuthValidation, upsertUser);
router.post('/getTelegramInvite', getTelegramInvite);
exports.default = router;
