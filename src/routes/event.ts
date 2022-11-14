import express, { Request, Response } from 'express';
import Joi from 'joi';
import { db } from '../db/db';
import { appExists, checkUniqueEvent, eventExists, handleError, providerExists, validatePayload } from '../helper';
import { authValidation } from '../middleware/authValidation';

const router = express.Router();

const createSchema = Joi.object({
  appName: Joi.string().required(),
  ownerAddress: Joi.string().required(),
  eventName: Joi.string().required(),
  template: Joi.object().required(),
  metadata: Joi.object().optional(),
});

const connectSchema = Joi.object({
  appName: Joi.string().required(),
  ownerAddress: Joi.string().required(),
  eventName: Joi.string().required(),
  providerName: Joi.string().required(),
});

type CreateEventRequestBody = {
  readonly appName: string;
  readonly ownerAddress: string;
  readonly eventName: string;
  readonly template: Record<string, string>;
  readonly metadata?: Record<string, string>;
};

type ConnectEventRequestBody = {
  readonly appName: string;
  readonly ownerAddress: string;
  readonly eventName: string;
  readonly providerName: string;
};

const createEvent = async ({ body, ownerAddress }: Request, res: Response) => {
  try {
    const payload: CreateEventRequestBody | undefined = validatePayload(
      { ...body, ownerAddress: ownerAddress },
      createSchema,
    );
    if (payload === undefined) return;
    // app exists
    const app = await appExists(payload.appName, payload.ownerAddress);
    await checkUniqueEvent(app.id, payload.eventName);

    const event = await db.event.create(app.id, {
      name: payload.eventName,
      template: payload.template,
      metadata: payload.metadata,
    });

    return res.status(200).send(event);
  } catch (err) {
    return handleError(err, res);
  }
};

const getEvent = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName || !body.eventName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(body.appName, ownerAddress!);
    const event = await db.event.get(app.id, body.eventName);
    return res.status(200).send(event);
  } catch (err) {
    return handleError(err, res);
  }
};

const deleteEvent = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName || !body.eventName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(body.appName, ownerAddress!);
    await eventExists(app.id, body.eventName);
    await db.event.delete(app.id, body.eventName);
    return res.sendStatus(200);
  } catch (err) {
    return handleError(err, res);
  }
};

const connectProvider = async ({ body, ownerAddress }: Request, res: Response) => {
  try {
    const payload: ConnectEventRequestBody | undefined = validatePayload(
      { ...body, ownerAddress: ownerAddress },
      connectSchema,
    );
    if (payload === undefined) return;
    const app = await appExists(payload.appName, payload.ownerAddress);
    await providerExists(app.id, payload.providerName);
    await eventExists(app.id, payload.eventName);

    const updatedData = await db.event.connectProvider(app.id, payload.eventName, payload.providerName);
    return res.status(200).send(updatedData);
  } catch (err) {
    return handleError(err, res);
  }
};

const disconnectProvider = async ({ body, ownerAddress }: Request, res: Response) => {
  try {
    const payload: ConnectEventRequestBody | undefined = validatePayload(
      { ...body, ownerAddress: ownerAddress },
      connectSchema,
    );
    if (payload === undefined) return;
    const app = await appExists(payload.appName, payload.ownerAddress);
    await providerExists(app.id, payload.providerName);
    await eventExists(app.id, payload.eventName);

    await db.event.disconnectProvider(app.id, payload.eventName, payload.providerName);
    return res.sendStatus(200);
  } catch (err) {
    return handleError(err, res);
  }
};

const getConnectedProviders = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName || !body.eventName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(body.appName, ownerAddress!);
    await eventExists(app.id, body.eventName);
    const data = await db.event.getConnectedProviders(app.id, body.eventName);
    return res.status(200).send(data);
  } catch (err) {
    return handleError(err, res);
  }
};

router.post('/get', authValidation, getEvent);
router.post('/create', authValidation, createEvent);
router.post('/delete', authValidation, deleteEvent);

router.post('/connect', authValidation, connectProvider);
router.post('/disconnect', authValidation, disconnectProvider);
router.post('/getConnectedProviders', authValidation, getConnectedProviders);

export default router;
