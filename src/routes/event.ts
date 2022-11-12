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
  template: Joi.string().required(),
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
  readonly template: string;
  readonly metadata?: Record<string, string>;
};

type ConnectEventRequestBody = {
  readonly appName: string;
  readonly ownerAddress: string;
  readonly eventName: string;
  readonly providerName: string;
};

const createEvent = async ({ params, body, ownerAddress }: Request, res: Response) => {
  try {
    const payload: CreateEventRequestBody | undefined = validatePayload(
      { appName: params.appName, ...body, ownerAddress: ownerAddress },
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

const getEvent = async ({ params, ownerAddress }: Request, res: Response) => {
  if (!params.appName || !params.eventName || !ownerAddress) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
  const app = await appExists(params.appName, ownerAddress);
    const event = await db.event.get(app.id, params.eventName);
    return res.status(200).send(event);
  } catch (err) {
    return handleError(err, res);
  }
};

const deleteEvent = async ({ body, params, ownerAddress }: Request, res: Response) => {
  if (!params.appName || !body.eventName || !ownerAddress) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(params.appName, ownerAddress);
    await eventExists(app.id, body.eventName);
    await db.event.delete(app.id, body.eventName);
    return res.sendStatus(200);
  } catch (err) {
    return handleError(err, res);
  }
};

const connectProvider = async ({ body, params, ownerAddress }: Request, res: Response) => {
  try {
    const payload: ConnectEventRequestBody | undefined = validatePayload(
      { appName: params.appName, eventName: params.eventName, ...body, ownerAddress: ownerAddress },
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

const disconnectProvider = async ({ body, params, ownerAddress }: Request, res: Response) => {
  try {
    const payload: ConnectEventRequestBody | undefined = validatePayload(
      { appName: params.appName, eventName: params.eventName, ...body, ownerAddress: ownerAddress },
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

router.get('/:appName/events/:eventName', authValidation, getEvent);
router.post('/:appName/events/create', authValidation, createEvent);
router.post('/:appName/events/delete', authValidation, deleteEvent);

router.post('/:appName/events/:eventName/connect', authValidation, connectProvider);
router.post('/:appName/events/:eventName/disconnect', authValidation, disconnectProvider);

export default router;
