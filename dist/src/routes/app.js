"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const generator_1 = require("../generator");
const helper_1 = require("../helper");
const authValidation_1 = require("../middleware/authValidation");
const router = express_1.default.Router();
const getAllApps = async (req, res) => {
    const app = await db_1.db.app.getAll(req.ownerAddress);
    return res.status(200).send(app);
};
const createApp = async (req, res) => {
    if (!req.body.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });
    try {
        await (0, helper_1.checkUniqueApp)(req.body.appName, req.ownerAddress);
        const account = await db_1.db.account.get(req.ownerAddress);
        const app = await db_1.db.app.create({
            name: req.body.appName,
            description: req.body.description,
            ownerAddress: req.ownerAddress,
        });
        await (0, generator_1.generateProject)(req.body.appName, account?.contractAddress ?? '');
        return res.status(200).send(app);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const updateApp = async (req, res) => {
    if (!req.body.appName || !req.body.updatedAppName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });
    try {
        await (0, helper_1.checkUniqueApp)(req.body.updatedAppName, req.ownerAddress);
        const app = await db_1.db.app.update(req.body.appName, req.ownerAddress, { name: req.body.updatedAppName });
        return res.status(200).send(app);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const getApp = async ({ body, ownerAddress }, res) => {
    if (!body.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });
    const app = await db_1.db.app.get(body.appName, ownerAddress);
    return res.status(200).send(app);
};
const deleteApp = async (req, res) => {
    if (!req.body.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });
    await db_1.db.app.delete(req.body.appName, req.ownerAddress);
    return res.status(200).send('App Deleted Successfully');
};
router.get('/getAll', authValidation_1.authValidation, getAllApps);
router.post('/get', authValidation_1.authValidation, getApp);
router.post('/update', authValidation_1.authValidation, updateApp);
router.post('/create', authValidation_1.authValidation, createApp);
router.post('/delete', authValidation_1.authValidation, deleteApp);
exports.default = router;
