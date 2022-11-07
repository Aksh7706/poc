"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const router = express_1.default.Router();
const createApp = async (req, res) => {
    if (!req.body.name)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });
    const app = await db_1.db.app.create({
        name: req.body.name,
        description: req.body.description,
    });
    return res.status(200).send(app);
};
const getApp = async (req, res) => {
    if (!req.params.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });
    const app = await db_1.db.app.get(req.params.appName);
    return res.status(200).send(app);
};
const deleteApp = async (req, res) => {
    if (!req.body.name)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });
    await db_1.db.app.delete(req.body.name);
    return res.status(200).send('App Deleted Successfully');
};
router.get('/:appName', getApp);
router.post('/create', createApp);
router.post('/delete', deleteApp);
exports.default = router;
