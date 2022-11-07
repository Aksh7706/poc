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
const router = express_1.default.Router();
const schema = joi_1.default.object({
    app: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    channel: joi_1.default.string()
        .required()
        .valid(...Object.values(client_1.Channel)),
    providerKey: joi_1.default.string()
        .required()
        .valid(...Object.values(client_1.ProviderKey)),
});
function validatePayload(res, body, app) {
    const { value, error, warning } = schema.validate({ app: app, ...body });
    if (error === undefined && warning === undefined)
        return { config: body.config, description: body.description, ...value };
    res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: error ?? warning });
    return undefined;
}
const createProvider = async ({ params, body }, res) => {
    const payload = validatePayload(res, body, params.appName);
    if (payload === undefined)
        return;
    try {
        // app exists
        (0, helper_1.appExists)(payload.app);
        (0, helper_1.checkUniqueProvider)(payload.app, payload.name);
        const providerApi = new provider_1.Provider();
        providerApi.setupProvider({
            app: payload.app,
            channel: payload.channel,
            config: payload.config ?? {},
            provider: payload.provider,
        });
    }
    catch (err) {
        return res.status(400).send(err);
    }
    const provider = await db_1.db.provider.create(payload.app, {
        name: payload.name,
        channel: payload.channel,
        providerKey: payload.provider,
        config: payload.config,
        description: payload.description,
    });
    return res.status(200).send(provider);
};
const getProvider = async ({ params }, res) => {
    if (!params.appName || !params.providerName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        let err = (0, helper_1.appExists)(params.appName);
        if (!err)
            throw err;
        const provider = await db_1.db.provider.get(params.appName, params.providerName);
        return res.status(200).send(provider);
    }
    catch (err) {
        return res.status(400).send(err);
    }
};
const deleteProvider = async ({ body, params }, res) => {
    if (!params.appName || !body.providerName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        let err = (0, helper_1.appExists)(params.appName);
        if (!err)
            throw err;
        await db_1.db.provider.delete(params.appName, body.providerName);
        return res.sendStatus(200);
    }
    catch (err) {
        return res.status(400).send(err);
    }
};
router.get('/:appName/providers/:providerName', getProvider);
router.post('/:appName/providers/create', createProvider);
router.post('/:appName/providers/delete', deleteProvider);
exports.default = router;
