"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const router = express_1.default.Router();
const createEvent = async ({ params, body }, res) => {
    if (!params.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    // TODO: app exists
    // TODO: provider exists
    // TODO: validate params
    const event = await db_1.db.event.create(params.appName, {
        name: body.name,
        providerId: body.providerId,
        template: body.template,
    });
    return res.status(200).send(event);
};
const getEvent = async ({ params }, res) => {
    if (!params.appName || !params.eventName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    // TODO: app exists
    // TODO: validate params
    const event = await db_1.db.event.get(params.appName, params.eventName);
    return res.status(200).send(event);
};
router.get('/:appName/events/:eventName', getEvent);
router.post('/:appName/events/create', createEvent);
exports.default = router;
