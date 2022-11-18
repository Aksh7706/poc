import express, { Request, Response } from 'express';
import Joi from 'joi';
import { db } from '../db/db';
import { appExists, checkUniqueEvent, eventExists, handleError, providerExists, validatePayload } from '../helper';
import { authValidation } from '../middleware/authValidation';
import { AppData } from '../types';

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
  providerName: Joi.array().items(Joi.string()),
});

type CreateEventRequestBody = {
  readonly appName: string;
  readonly ownerAddress: string;
  readonly eventName: string;
  readonly template: Record<string, Record<string, string>>;
  readonly metadata?: Record<string, string>;
};

type ConnectEventRequestBody = {
  readonly appName: string;
  readonly ownerAddress: string;
  readonly eventName: string;
  readonly providerName: string[];
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

const updateEvent = async ({ body, ownerAddress }: Request, res: Response) => {
  try {
    const payload: CreateEventRequestBody | undefined = validatePayload(
      { ...body, ownerAddress: ownerAddress },
      createSchema,
    );
    if (payload === undefined) return;
    // app exists
    const app = await appExists(payload.appName, payload.ownerAddress);
    await eventExists(app.id, payload.eventName);

    const event = await db.event.update(app.id, payload.eventName, {
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

const getAllEvents = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(body.appName, ownerAddress!);
    const events = await db.event.getAll(app.id);
    return res.status(200).send(events);
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
    await eventExists(app.id, payload.eventName);

    const data = await connectHelper(app, payload);
    return res.status(200).send(data);
  } catch (err) {
    return handleError(err, res);
  }
};

const updateConnectedProvider = async ({ body, ownerAddress }: Request, res: Response) => {
  try {
    const payload: ConnectEventRequestBody | undefined = validatePayload(
      { ...body, ownerAddress: ownerAddress },
      connectSchema,
    );
    if (payload === undefined) return;
    const app = await appExists(payload.appName, payload.ownerAddress);
    await eventExists(app.id, payload.eventName);

    await db.event.disconnectAllProvider(app.id, payload.eventName);

    const data = await connectHelper(app, payload);
    return res.status(200).send(data);
  } catch (err) {
    return handleError(err, res);
  }
};

const connectHelper = async (app: AppData, payload: ConnectEventRequestBody) => {
  let failedConnect: string[] = [];
  let successConnect: string[] = [];

  await Promise.all(
    payload.providerName.map(async (pName) => {
      const provider = await db.provider.get(app.id, pName);
      if (!provider) {
        failedConnect.push(pName);
        return;
      }
      await db.event.connectProvider(app.id, payload.eventName, pName);
      successConnect.push(pName);
    }),
  );

  return {
    appName: payload.appName,
    eventName: payload.eventName,
    requestedConnect: payload.providerName,
    successConnect: successConnect,
    failedConnect: failedConnect,
    failedCount: failedConnect.length,
  };
};

const disconnectProvider = async ({ body, ownerAddress }: Request, res: Response) => {
  try {
    const payload: ConnectEventRequestBody | undefined = validatePayload(
      { ...body, ownerAddress: ownerAddress },
      connectSchema,
    );
    if (payload === undefined) return;
    const app = await appExists(payload.appName, payload.ownerAddress);
    await eventExists(app.id, payload.eventName);

    let failedDisconnect: string[] = [];
    let successDisconnect: string[] = [];

    await Promise.all(
      payload.providerName.map(async (pName) => {
        const provider = await db.provider.get(app.id, pName);
        if (!provider) {
          failedDisconnect.push(pName);
          return;
        }
        await db.event.disconnectProvider(app.id, payload.eventName, pName);
        successDisconnect.push(pName);
      }),
    );

    return res.status(200).send({
      appName: payload.appName,
      eventName: payload.eventName,
      requestedConnect: payload.providerName,
      successDisconnect: successDisconnect,
      failedDisconnect: failedDisconnect,
      failedCount: failedDisconnect.length,
    });
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
router.post('/getAll', authValidation, getAllEvents);
router.post('/create', authValidation, createEvent);
router.post('/update', authValidation, updateEvent);
router.post('/delete', authValidation, deleteEvent);

router.post('/connect', authValidation, connectProvider);
router.post('/disconnect', authValidation, disconnectProvider);
router.post('/updateConnected', authValidation, updateConnectedProvider);
router.post('/getConnectedProviders', authValidation, getConnectedProviders);

export default router;
