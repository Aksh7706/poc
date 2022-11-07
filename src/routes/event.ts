import express, { Request, Response } from 'express';
import Joi from 'joi';
import { db } from '../db/db';
import { appExists, checkUniqueEvent, eventExists, handleError, providerExists, validatePayload } from '../helper';

const router = express.Router();

const createSchema = Joi.object({
  appName: Joi.string().required(),
  eventName: Joi.string().required(),
  template: Joi.string().required(),
  metadata: Joi.object().optional(),
});

const connectSchema = Joi.object({
  appName: Joi.string().required(),
  eventName: Joi.string().required(),
  providerName: Joi.string().required(),
});

type CreateEventRequestBody = {
  readonly appName: string;
  readonly eventName: string;
  readonly template: string;
  readonly metadata?: Record<string, string>;
};

type ConnectEventRequestBody = {
  readonly appName: string;
  readonly eventName: string;
  readonly providerName: string;
};

const createEvent = async ({ params, body }: Request, res: Response) => {
  try {
    const payload: CreateEventRequestBody | undefined = validatePayload(
      { appName: params.appName, ...body },
      createSchema,
    );
    if (payload === undefined) return;
    // app exists
    await appExists(payload.appName);
    await checkUniqueEvent(payload.appName, payload.eventName);

    const event = await db.event.create(payload.appName, {
      name: payload.eventName,
      template: payload.template,
      metadata: payload.metadata,
    });

    return res.status(200).send(event);
  } catch (err) {
    return handleError(err, res);
  }
};

const getEvent = async ({ params }: Request, res: Response) => {
  if (!params.appName || !params.eventName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    await appExists(params.appName);
    const event = await db.event.get(params.appName, params.eventName);
    return res.status(200).send(event);
  } catch (err) {
    return handleError(err, res);
  }
};

const deleteEvent = async ({ body, params }: Request, res: Response) => {
  if (!params.appName || !body.eventName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    await appExists(params.appName);
    await eventExists(params.appName, body.eventName);
    await db.event.delete(params.appName, body.eventName);
    return res.sendStatus(200);
  } catch (err) {
    return handleError(err, res);
  }
};

const connectProvider = async ({ body, params }: Request, res: Response) => {
  try {
    const payload: ConnectEventRequestBody | undefined = validatePayload(
      { appName: params.appName, eventName: params.eventName, ...body },
      connectSchema,
    );
    if (payload === undefined) return;
    await appExists(payload.appName);
    await providerExists(payload.appName, payload.providerName);
    await eventExists(payload.appName, payload.eventName);

    const updatedData = await db.event.connectProvider(payload.appName, payload.eventName, payload.providerName);
    return res.status(200).send(updatedData);
  } catch (err) {
    return handleError(err, res);
  }
};

const disconnectProvider = async ({ body, params }: Request, res: Response) => {
  try {
    const payload: ConnectEventRequestBody | undefined = validatePayload(
      { appName: params.appName, eventName: params.eventName, ...body },
      connectSchema,
    );
    if (payload === undefined) return;
    await appExists(payload.appName);
    await providerExists(payload.appName, payload.providerName);
    await eventExists(payload.appName, payload.eventName);

    await db.event.disconnectProvider(payload.appName, payload.eventName, payload.providerName);
    return res.sendStatus(200);
  } catch (err) {
    return handleError(err, res);
  }
};

router.get('/:appName/events/:eventName', getEvent);
router.post('/:appName/events/create', createEvent);
router.post('/:appName/events/delete', deleteEvent);

router.post('/:appName/events/:eventName/connect', connectProvider);
router.post('/:appName/events/:eventName/disconnect', disconnectProvider);

export default router;
