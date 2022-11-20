"use strict";
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
    providerName: joi_1.default.array().items(joi_1.default.string()),
});
const createEvent = async ({ body, ownerAddress }, res) => {
    try {
        const payload = (0, helper_1.validatePayload)({ ...body, ownerAddress: ownerAddress }, createSchema);
        if (payload === undefined)
            return;
        // app exists
        const app = await (0, helper_1.appExists)(payload.appName, payload.ownerAddress);
        await (0, helper_1.checkUniqueEvent)(app.id, payload.eventName);
        const event = await db_1.db.event.create(app.id, {
            name: payload.eventName,
            template: payload.template,
            metadata: payload.metadata,
        });
        return res.status(200).send(event);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const updateEvent = async ({ body, ownerAddress }, res) => {
    try {
        const payload = (0, helper_1.validatePayload)({ ...body, ownerAddress: ownerAddress }, createSchema);
        if (payload === undefined)
            return;
        // app exists
        const app = await (0, helper_1.appExists)(payload.appName, payload.ownerAddress);
        await (0, helper_1.eventExists)(app.id, payload.eventName);
        const event = await db_1.db.event.update(app.id, payload.eventName, {
            template: payload.template,
            metadata: payload.metadata,
        });
        return res.status(200).send(event);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const getEvent = async ({ body, ownerAddress }, res) => {
    if (!body.appName || !body.eventName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = await (0, helper_1.appExists)(body.appName, ownerAddress);
        const event = await db_1.db.event.get(app.id, body.eventName);
        return res.status(200).send(event);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const getAllEvents = async ({ body, ownerAddress }, res) => {
    if (!body.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = await (0, helper_1.appExists)(body.appName, ownerAddress);
        const events = await db_1.db.event.getAll(app.id);
        return res.status(200).send(events);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const deleteEvent = async ({ body, ownerAddress }, res) => {
    if (!body.appName || !body.eventName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = await (0, helper_1.appExists)(body.appName, ownerAddress);
        await (0, helper_1.eventExists)(app.id, body.eventName);
        await db_1.db.event.delete(app.id, body.eventName);
        return res.sendStatus(200);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const connectProvider = async ({ body, ownerAddress }, res) => {
    try {
        const payload = (0, helper_1.validatePayload)({ ...body, ownerAddress: ownerAddress }, connectSchema);
        if (payload === undefined)
            return;
        const app = await (0, helper_1.appExists)(payload.appName, payload.ownerAddress);
        await (0, helper_1.eventExists)(app.id, payload.eventName);
        const data = await connectHelper(app, payload);
        return res.status(200).send(data);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const updateConnectedProvider = async ({ body, ownerAddress }, res) => {
    try {
        const payload = (0, helper_1.validatePayload)({ ...body, ownerAddress: ownerAddress }, connectSchema);
        if (payload === undefined)
            return;
        const app = await (0, helper_1.appExists)(payload.appName, payload.ownerAddress);
        await (0, helper_1.eventExists)(app.id, payload.eventName);
        await db_1.db.event.disconnectAllProvider(app.id, payload.eventName);
        const data = await connectHelper(app, payload);
        return res.status(200).send(data);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const connectHelper = async (app, payload) => {
    let failedConnect = [];
    let successConnect = [];
    await Promise.all(payload.providerName.map(async (pName) => {
        const provider = await db_1.db.provider.get(app.id, pName);
        if (!provider) {
            failedConnect.push(pName);
            return;
        }
        await db_1.db.event.connectProvider(app.id, payload.eventName, pName);
        successConnect.push(pName);
    }));
    return {
        appName: payload.appName,
        eventName: payload.eventName,
        requestedConnect: payload.providerName,
        successConnect: successConnect,
        failedConnect: failedConnect,
        failedCount: failedConnect.length,
    };
};
const disconnectProvider = async ({ body, ownerAddress }, res) => {
    try {
        const payload = (0, helper_1.validatePayload)({ ...body, ownerAddress: ownerAddress }, connectSchema);
        if (payload === undefined)
            return;
        const app = await (0, helper_1.appExists)(payload.appName, payload.ownerAddress);
        await (0, helper_1.eventExists)(app.id, payload.eventName);
        let failedDisconnect = [];
        let successDisconnect = [];
        await Promise.all(payload.providerName.map(async (pName) => {
            const provider = await db_1.db.provider.get(app.id, pName);
            if (!provider) {
                failedDisconnect.push(pName);
                return;
            }
            await db_1.db.event.disconnectProvider(app.id, payload.eventName, pName);
            successDisconnect.push(pName);
        }));
        return res.status(200).send({
            appName: payload.appName,
            eventName: payload.eventName,
            requestedConnect: payload.providerName,
            successDisconnect: successDisconnect,
            failedDisconnect: failedDisconnect,
            failedCount: failedDisconnect.length,
        });
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
const getConnectedProviders = async ({ body, ownerAddress }, res) => {
    if (!body.appName || !body.eventName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = await (0, helper_1.appExists)(body.appName, ownerAddress);
        await (0, helper_1.eventExists)(app.id, body.eventName);
        const data = await db_1.db.event.getConnectedProviders(app.id, body.eventName);
        return res.status(200).send(data);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
router.post('/get', authValidation_1.authValidation, getEvent);
router.post('/getAll', authValidation_1.authValidation, getAllEvents);
router.post('/create', authValidation_1.authValidation, createEvent);
router.post('/update', authValidation_1.authValidation, updateEvent);
router.post('/delete', authValidation_1.authValidation, deleteEvent);
router.post('/connect', authValidation_1.authValidation, connectProvider);
router.post('/disconnect', authValidation_1.authValidation, disconnectProvider);
router.post('/updateConnected', authValidation_1.authValidation, updateConnectedProvider);
router.post('/getConnectedProviders', authValidation_1.authValidation, getConnectedProviders);
exports.default = router;
