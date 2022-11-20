"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const provider_1 = require("../providers/provider");
const joi_1 = __importDefault(require("joi"));
const helper_1 = require("../helper");
const authValidation_1 = require("../middleware/authValidation");
const allProvider_json_1 = __importDefault(require("../static/allProvider.json"));
const router = express_1.default.Router();
const createSchema = joi_1.default.object({
    appName: joi_1.default.string().required(),
    providerName: joi_1.default.string().required(),
    channel: joi_1.default.string()
        .required()
        .valid(...Object.values(client_1.Channel)),
    providerType: joi_1.default.string()
        .required()
        .valid(...Object.values(client_1.ProviderKey)),
    config: joi_1.default.object().optional(),
    description: joi_1.default.object().optional(),
});
const createProvider = async ({ body, ownerAddress }, res) => {
    try {
        const payload = (0, helper_1.validatePayload)(body, createSchema);
        if (payload === undefined)
            return;
        // app exists
        const app = await (0, helper_1.appExists)(payload.appName, ownerAddress);
        await (0, helper_1.checkUniqueProvider)(app.id, payload.providerName);
        const providerApi = new provider_1.Provider(db_1.prismaClient);
        await providerApi.setupProvider({
            appId: app.id,
            providerName: payload.providerName,
            channel: payload.channel,
            config: payload.config ?? {},
            provider: payload.providerType,
        });
        const provider = await db_1.db.provider.create(app.id, {
            name: payload.providerName,
            channel: payload.channel,
            providerKey: payload.providerType,
            config: payload.config,
            description: payload.description,
        });
        return res.status(200).send(provider);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const getAllProviders = async ({ body, ownerAddress }, res) => {
    if (!body.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = await (0, helper_1.appExists)(body.appName, ownerAddress);
        const providers = await db_1.db.provider.getAll(app.id);
        return res.status(200).send(providers);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const getProvider = async ({ body, ownerAddress }, res) => {
    if (!body.appName || !body.providerName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = await (0, helper_1.appExists)(body.appName, ownerAddress);
        const provider = await db_1.db.provider.get(app.id, body.providerName);
        return res.status(200).send(provider);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const deleteProvider = async ({ body, ownerAddress }, res) => {
    if (!body.appName || !body.providerName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = await (0, helper_1.appExists)(body.appName, ownerAddress);
        const provider = await (0, helper_1.providerExists)(app.id, body.providerName);
        const providerApi = new provider_1.Provider(db_1.prismaClient);
        await providerApi.removeProvider({
            appId: app.id,
            channel: provider.channel,
            config: provider.config,
            provider: provider.providerKey,
            providerName: provider.name,
        });
        await db_1.db.provider.delete(app.id, provider.name);
        return res.sendStatus(200);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const getConnectedEvents = async ({ body, ownerAddress }, res) => {
    if (!body.appName || !body.providerName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = await (0, helper_1.appExists)(body.appName, ownerAddress);
        const provider = await (0, helper_1.providerExists)(app.id, body.providerName);
        const data = await db_1.db.provider.getConnectedEvents(app.id, provider.name);
        return res.status(200).send(data);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const allAvailableProviders = async (_, res) => {
    return res.status(200).json(allProvider_json_1.default);
};
router.post('/get', authValidation_1.authValidation, getProvider);
router.post('/getAll', authValidation_1.authValidation, getAllProviders);
router.post('/create', authValidation_1.authValidation, createProvider);
router.post('/delete', authValidation_1.authValidation, deleteProvider);
router.post('/getConnectedEvents', authValidation_1.authValidation, getConnectedEvents);
router.get('/allAvailable', allAvailableProviders);
exports.default = router;
