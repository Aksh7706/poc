"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const createProvider = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const payload = (0, helper_1.validatePayload)(body, createSchema);
        if (payload === undefined)
            return;
        // app exists
        const app = yield (0, helper_1.appExists)(payload.appName, ownerAddress);
        yield (0, helper_1.checkUniqueProvider)(app.id, payload.providerName);
        const providerApi = new provider_1.Provider();
        yield providerApi.setupProvider({
            appId: app.id,
            providerName: payload.providerName,
            channel: payload.channel,
            config: (_a = payload.config) !== null && _a !== void 0 ? _a : {},
            provider: payload.providerType,
        });
        const provider = yield db_1.db.provider.create(app.id, {
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
});
const getAllProviders = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = yield (0, helper_1.appExists)(body.appName, ownerAddress);
        const providers = yield db_1.db.provider.getAll(app.id);
        return res.status(200).send(providers);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
const getProvider = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.appName || !body.providerName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = yield (0, helper_1.appExists)(body.appName, ownerAddress);
        const provider = yield db_1.db.provider.get(app.id, body.providerName);
        return res.status(200).send(provider);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
const deleteProvider = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.appName || !body.providerName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = yield (0, helper_1.appExists)(body.appName, ownerAddress);
        const provider = yield (0, helper_1.providerExists)(app.id, body.providerName);
        const providerApi = new provider_1.Provider();
        yield providerApi.removeProvider({
            appId: app.id,
            channel: provider.channel,
            config: provider.config,
            provider: provider.providerKey,
            providerName: provider.name,
        });
        yield db_1.db.provider.delete(app.id, provider.name);
        return res.sendStatus(200);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
const getConnectedEvents = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.appName || !body.providerName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = yield (0, helper_1.appExists)(body.appName, ownerAddress);
        const provider = yield (0, helper_1.providerExists)(app.id, body.providerName);
        const data = yield db_1.db.provider.getConnectedEvents(app.id, provider.name);
        return res.status(200).send(data);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
const allAvailableProviders = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json(allProvider_json_1.default);
});
router.post('/get', authValidation_1.authValidation, getProvider);
router.post('/getAll', authValidation_1.authValidation, getAllProviders);
router.post('/create', authValidation_1.authValidation, createProvider);
router.post('/delete', authValidation_1.authValidation, deleteProvider);
router.post('/getConnectedEvents', authValidation_1.authValidation, getConnectedEvents);
router.get('/allAvailable', allAvailableProviders);
exports.default = router;
