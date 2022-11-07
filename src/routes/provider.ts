import { Channel, ProviderKey } from '@prisma/client';
import express, { Request, Response } from 'express';
import { db } from '../db/db';
import { Provider } from '../providers/provider';
import Joi from 'joi';
import { appExists, checkUniqueProvider, handleError, providerExists } from '../helper';
import { ErrorGeneric } from '../types';

const router = express.Router();

const schema = Joi.object({
  app: Joi.string().required(),
  name: Joi.string().required(),
  channel: Joi.string()
    .required()
    .valid(...Object.values(Channel)),
  provider: Joi.string()
    .required()
    .valid(...Object.values(ProviderKey)),
  config: Joi.object().optional(),
  description: Joi.object().optional(),
});

type PostRequestBody = {
  readonly app: string;
  readonly name: string;
  readonly channel: Channel;
  readonly provider: ProviderKey;
  readonly config?: Record<string, string>;
  readonly description?: string;
};

function validatePayload(body: any, app?: string): PostRequestBody | undefined {
  const { value, error, warning } = schema.validate({ app: app, ...body });
  if (error === undefined && warning === undefined) return value;
  throw new ErrorGeneric({ reason: 'INVALID_PAYLOAD', explanation: error ?? warning });
}

const createProvider = async ({ params, body }: Request, res: Response) => {
  try {
    const payload = validatePayload(body, params.appName);
    if (payload === undefined) return;
    // app exists
    await appExists(payload.app);
    await checkUniqueProvider(payload.app, payload.name);

    const providerApi = new Provider();
    await providerApi.setupProvider({
      app: payload.app,
      providerName: payload.name,
      channel: payload.channel,
      config: payload.config ?? {},
      provider: payload.provider,
    });

    const provider = await db.provider.create(payload.app, {
      name: payload.name,
      channel: payload.channel,
      providerKey: payload.provider,
      config: payload.config,
      description: payload.description,
    });

    return res.status(200).send(provider);
  } catch (err) {
    return handleError(err, res);
  }
};

const getProvider = async ({ params }: Request, res: Response) => {
  if (!params.appName || !params.providerName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    await appExists(params.appName);
    const provider = await db.provider.get(params.appName, params.providerName);
    return res.status(200).send(provider);
  } catch (err) {
    return handleError(err, res);
  }
};

const deleteProvider = async ({ body, params }: Request, res: Response) => {
  if (!params.appName || !body.providerName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    await appExists(params.appName);
    const provider = await providerExists(params.appName, body.providerName);
    const providerApi = new Provider();

    await providerApi.removeProvider({
      app: provider.appName,
      channel: provider.channel,
      config: provider.config as Record<string,string>,
      provider: provider.providerKey,
      providerName: provider.name
    })

    await db.provider.delete(provider.appName, provider.name);
    return res.sendStatus(200);
  } catch (err) {
    return handleError(err, res);
  }
};

router.get('/:appName/providers/:providerName', getProvider);
router.post('/:appName/providers/create', createProvider);
router.post('/:appName/providers/delete', deleteProvider);

export default router;
