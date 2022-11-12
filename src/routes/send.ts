import express, { Request, Response } from 'express';
import Handlebars from 'handlebars';
import Joi from 'joi';
import { db } from '../db/db';
import { appExists, eventExists, handleError, userExists, validatePayload } from '../helper';
import { authValidation } from '../middleware/authValidation';
import { Provider } from '../providers/provider';

const router = express.Router();

export type sendEventArgs = {
  appName: string;
  eventName: string;
  ownerAddress: string;
  userWalletAddress: string;
  data?: Record<string, string>;
};

const sendSchema = Joi.object({
  appName: Joi.string().required(),
  eventName: Joi.string().required(),
  ownerAddress: Joi.string().required(),
  userWalletAddress: Joi.string().required(),
  data: Joi.object().optional(),
});

export const sendEventHelper = async ({ appName, eventName, userWalletAddress, data, ownerAddress }: sendEventArgs) => {
  const providerAPI = new Provider();

  const app = await appExists(appName, ownerAddress);
  const event = await eventExists(app.id, eventName);
  const user = await userExists(app.id, userWalletAddress);

  const template = Handlebars.compile(event.template);
  const message = template(data);

  await Promise.all(
    event.connectedProviders.map(async (eventProvider) => {
      const provider = await db.provider.get(app.id, eventProvider.providerName);
      if (!provider) return;
      await providerAPI.send({
        app: app,
        event: event,
        provider: provider,
        user: user,
        message: message,
      });
    }),
  );
};

const sendEvent = async ({ body, params, ownerAddress }: Request, res: Response) => {
  try {
    const payload: sendEventArgs | undefined = validatePayload(
      { appName: params.appName, ownerAddress: ownerAddress, ...body },
      sendSchema,
    );
    if (payload === undefined) return;
    await sendEventHelper(payload);
    res.sendStatus(200);
  } catch (err) {
    return handleError(err, res);
  }
};

router.post('/send/:appName', authValidation, sendEvent);

export default router;
