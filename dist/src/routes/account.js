"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const generator_1 = require("../generator");
const authValidation_1 = require("../middleware/authValidation");
const router = express_1.default.Router();
const getAccount = async (req, res) => {
    if (!req.ownerAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'Something went wrong.' });
    const account = await db_1.db.account.get(req.ownerAddress);
    return res.status(200).send(account);
};
const updateAccount = async (req, res) => {
    if (!req.ownerAddress || !req.body.accountName || !req.body.contractAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'Something went wrong.' });
    const account = await db_1.db.account.update(req.ownerAddress, {
        name: req.body.accountName,
        contractAddress: req.body.contractAddress,
    });
    return res.status(200).send(account);
};
const deleteAccount = async (req, res) => {
    if (!req.ownerAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'Something went wrong.' });
    await db_1.db.account.delete(req.ownerAddress);
    return res.sendStatus(200);
};
const setUpAccount = async (req, res) => {
    if (!req.ownerAddress || !req.body.accountName || !req.body.contractAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'Something went wrong.' });
    const account = await db_1.db.account.update(req.ownerAddress, {
        name: req.body.accountName,
        contractAddress: req.body.contractAddress,
    });
    const appName = 'Demo App';
    const template = `<p>You invoked the method <strong>&quot;{{methodName}}&quot;</strong> on <strong>&quot;{{contractAddress}}&quot;</strong>.</p><p><br></p><p>Please find more details at {{txUrl}}.</p>`;
    const app = await db_1.db.app.create({ name: appName, ownerAddress: account.ownerAddress });
    const event = await db_1.db.event.create(app.id, {
        name: 'Generic',
        template: {
            IN_APP: {
                message: template,
            },
        },
        metadata: {
            channels: 'IN_APP',
            onChain: 'true',
        },
    });
    const provider = await db_1.db.provider.create(app.id, {
        channel: 'IN_APP',
        name: 'Demo In App',
        providerKey: 'PIGEON',
    });
    await db_1.db.event.connectProvider(app.id, event.name, provider.name);
    await (0, generator_1.generateProject)(appName, req.body.contractAddress);
    return res.status(200).send(account);
};
router.get('/', authValidation_1.authValidation, getAccount);
router.post('/update', authValidation_1.authValidation, updateAccount);
router.get('/delete', authValidation_1.authValidation, deleteAccount);
router.post('/setup', authValidation_1.authValidation, setUpAccount);
exports.default = router;
