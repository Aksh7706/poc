import { Channel, ProviderKey } from '@prisma/client';
import express, { Request, Response } from 'express';
import { db } from '../db/db';
import { Provider } from '../providers/provider';
import Joi from 'joi';
import { appExists, checkUniqueProvider, handleError, providerExists } from '../helper';
import { ErrorGeneric } from '../types';
import { authValidation } from '../middleware/authValidation';

const router = express.Router();

const schema = Joi.object({
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

type PostRequestBody = {
  readonly appName: string;
  readonly providerName: string;
  readonly channel: Channel;
  readonly providerType: ProviderKey;
  readonly config?: Record<string, string>;
  readonly description?: string;
};

function validatePayload(body: any, appName?: string): PostRequestBody | undefined {
  const { value, error, warning } = schema.validate({ appName: appName, ...body });
  if (error === undefined && warning === undefined) return value;
  throw new ErrorGeneric({ reason: 'INVALID_PAYLOAD', explanation: error ?? warning });
}

const createProvider = async ({ params, body, ownerAddress }: Request, res: Response) => {
  try {
    const payload = validatePayload(body, params.appName);
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

const getProvider = async ({ params, ownerAddress }: Request, res: Response) => {
  if (!params.appName || !params.providerName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(params.appName, ownerAddress!);
    const provider = await db.provider.get(app.id, params.providerName);
    return res.status(200).send(provider);
  } catch (err) {
    return handleError(err, res);
  }
};

const deleteProvider = async ({ body, params, ownerAddress }: Request, res: Response) => {
  if (!params.appName || !body.providerName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(params.appName, ownerAddress!);
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

router.get('/:appName/providers/:providerName', authValidation, getProvider);
router.post('/:appName/providers/create', authValidation, createProvider);
router.post('/:appName/providers/delete', authValidation, deleteProvider);

export default router;
