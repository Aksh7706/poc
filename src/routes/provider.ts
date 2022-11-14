import { Channel, ProviderKey } from '@prisma/client';
import express, { Request, Response } from 'express';
import { db } from '../db/db';
import { Provider } from '../providers/provider';
import Joi from 'joi';
import { appExists, checkUniqueProvider, handleError, providerExists, validatePayload } from '../helper';
import { authValidation } from '../middleware/authValidation';
import allProvidersData from '../static/allProvider.json';

const router = express.Router();

const createSchema = Joi.object({
  appName: Joi.string().required(),
  providerName: Joi.string().required(),
  channel: Joi.string()
    .required()
    .valid(...Object.values(Channel)),
  providerType: Joi.string()
    .required()
    .valid(...Object.values(ProviderKey)),
  config: Joi.object().optional(),
  description: Joi.object().optional(),
});

type CreateRequestBody = {
  readonly appName: string;
  readonly providerName: string;
  readonly channel: Channel;
  readonly providerType: ProviderKey;
  readonly config?: Record<string, string>;
  readonly description?: string;
};

const createProvider = async ({ body, ownerAddress }: Request, res: Response) => {
  try {
    const payload: CreateRequestBody = validatePayload(body, createSchema);
    if (payload === undefined) return;
    // app exists
    const app = await appExists(payload.appName, ownerAddress!);
    await checkUniqueProvider(app.id, payload.providerName);

    const providerApi = new Provider();
    await providerApi.setupProvider({
      appId: app.id,
      providerName: payload.providerName,
      channel: payload.channel,
      config: payload.config ?? {},
      provider: payload.providerType,
    });

    const provider = await db.provider.create(app.id, {
      name: payload.providerName,
      channel: payload.channel,
      providerKey: payload.providerType,
      config: payload.config,
      description: payload.description,
    });

    return res.status(200).send(provider);
  } catch (err) {
    return handleError(err, res);
  }
};

const getAllProviders = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(body.appName, ownerAddress!);
    const providers = await db.provider.getAll(app.id);
    return res.status(200).send(providers);
  } catch (err) {
    return handleError(err, res);
  }
};

const getProvider = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName || !body.providerName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(body.appName, ownerAddress!);
    const provider = await db.provider.get(app.id, body.providerName);
    return res.status(200).send(provider);
  } catch (err) {
    return handleError(err, res);
  }
};

const deleteProvider = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName || !body.providerName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(body.appName, ownerAddress!);
    const provider = await providerExists(app.id, body.providerName);
    const providerApi = new Provider();

    await providerApi.removeProvider({
      appId: app.id,
      channel: provider.channel,
      config: provider.config as Record<string, string>,
      provider: provider.providerKey,
      providerName: provider.name,
    });

    await db.provider.delete(app.id, provider.name);
    return res.sendStatus(200);
  } catch (err) {
    return handleError(err, res);
  }
};

const getConnectedEvents = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName || !body.providerName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(body.appName, ownerAddress!);
    const provider = await providerExists(app.id, body.providerName);
    const data = await db.provider.getConnectedEvents(app.id, provider.name);
    return res.status(200).send(data);
  } catch (err) {
    return handleError(err, res);
  }
};

const allAvailableProviders = async (_: Request, res: Response) => {
  return res.status(200).json(allProvidersData)
};

router.post('/get', authValidation, getProvider);
router.post('/getAll', authValidation, getAllProviders);
router.post('/create', authValidation, createProvider);
router.post('/delete', authValidation, deleteProvider);
router.post('/getConnectedEvents', authValidation, getConnectedEvents);

router.get('/allAvailable', allAvailableProviders);
export default router;
