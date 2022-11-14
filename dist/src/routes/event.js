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
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../db/db");
const helper_1 = require("../helper");
const authValidation_1 = require("../middleware/authValidation");
const router = express_1.default.Router();
const createSchema = joi_1.default.object({
    appName: joi_1.default.string().required(),
    ownerAddress: joi_1.default.string().required(),
    eventName: joi_1.default.string().required(),
    template: joi_1.default.object().required(),
    metadata: joi_1.default.object().optional(),
});
const connectSchema = joi_1.default.object({
    appName: joi_1.default.string().required(),
    ownerAddress: joi_1.default.string().required(),
    eventName: joi_1.default.string().required(),
    providerName: joi_1.default.string().required(),
});
const createEvent = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = (0, helper_1.validatePayload)(Object.assign(Object.assign({}, body), { ownerAddress: ownerAddress }), createSchema);
        if (payload === undefined)
            return;
        // app exists
        const app = yield (0, helper_1.appExists)(payload.appName, payload.ownerAddress);
        yield (0, helper_1.checkUniqueEvent)(app.id, payload.eventName);
        const event = yield db_1.db.event.create(app.id, {
            name: payload.eventName,
            template: payload.template,
            metadata: payload.metadata,
        });
        return res.status(200).send(event);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
const getEvent = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.appName || !body.eventName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = yield (0, helper_1.appExists)(body.appName, ownerAddress);
        const event = yield db_1.db.event.get(app.id, body.eventName);
        return res.status(200).send(event);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
const deleteEvent = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.appName || !body.eventName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = yield (0, helper_1.appExists)(body.appName, ownerAddress);
        yield (0, helper_1.eventExists)(app.id, body.eventName);
        yield db_1.db.event.delete(app.id, body.eventName);
        return res.sendStatus(200);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
const connectProvider = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = (0, helper_1.validatePayload)(Object.assign(Object.assign({}, body), { ownerAddress: ownerAddress }), connectSchema);
        if (payload === undefined)
            return;
        const app = yield (0, helper_1.appExists)(payload.appName, payload.ownerAddress);
        yield (0, helper_1.providerExists)(app.id, payload.providerName);
        yield (0, helper_1.eventExists)(app.id, payload.eventName);
        const updatedData = yield db_1.db.event.connectProvider(app.id, payload.eventName, payload.providerName);
        return res.status(200).send(updatedData);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
const disconnectProvider = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = (0, helper_1.validatePayload)(Object.assign(Object.assign({}, body), { ownerAddress: ownerAddress }), connectSchema);
        if (payload === undefined)
            return;
        const app = yield (0, helper_1.appExists)(payload.appName, payload.ownerAddress);
        yield (0, helper_1.providerExists)(app.id, payload.providerName);
        yield (0, helper_1.eventExists)(app.id, payload.eventName);
        yield db_1.db.event.disconnectProvider(app.id, payload.eventName, payload.providerName);
        return res.sendStatus(200);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
const getConnectedProviders = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.appName || !body.eventName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = yield (0, helper_1.appExists)(body.appName, ownerAddress);
        yield (0, helper_1.eventExists)(app.id, body.eventName);
        const data = yield db_1.db.event.getConnectedProviders(app.id, body.eventName);
        return res.status(200).send(data);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
router.post('/get', authValidation_1.authValidation, getEvent);
router.post('/create', authValidation_1.authValidation, createEvent);
router.post('/delete', authValidation_1.authValidation, deleteEvent);
router.post('/connect', authValidation_1.authValidation, connectProvider);
router.post('/disconnect', authValidation_1.authValidation, disconnectProvider);
router.post('/getConnectedProviders', authValidation_1.authValidation, getConnectedProviders);
exports.default = router;
