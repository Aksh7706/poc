import express, { Request, Response } from 'express';
import Joi from 'joi';
import { db } from '../db/db';
import { appExists, eventExists, handleError, userExists, validatePayload } from '../helper';
import { Provider } from '../providers/provider';

const router = express.Router();

export type sendEventArgs = {
  appName: string;
  eventName: string;
  userWalletAddress: string;
  data?: Record<string, string>;
};

const sendSchema = Joi.object({
  appName: Joi.string().required(),
  eventName: Joi.string().required(),
  userWalletAddress: Joi.string().required(),
  data: Joi.object().optional(),
});

export const sendEventHelper = async ({ appName, eventName, userWalletAddress }: sendEventArgs) => {
  const providerAPI = new Provider();

  const app = await appExists(appName);
  const event = await eventExists(appName, eventName);
  const user = await userExists(appName, userWalletAddress);

  await Promise.all(
    event.connectedProviders.map(async (eventProvider) => {
      const provider = await db.provider.get(appName, eventProvider.providerName);
      if (!provider) return;
      await providerAPI.send({
        app: app,
        event: event,
        provider: provider,
        user: user,
      });
    }),
  );
};

const sendEvent = async ({ body, params }: Request, res: Response) => {
  try {
    const payload: sendEventArgs | undefined = validatePayload({ appName: params.appName, ...body }, sendSchema);
    if (payload === undefined) return;
    await sendEventHelper(payload);
    res.sendStatus(200);
  } catch (err) {
    return handleError(err, res);
  }
};

router.post('/send/:appName', sendEvent);

export default router;