import express, { Request, Response } from 'express';
import Handlebars from 'handlebars';
import Joi from 'joi';
import { db } from '../db/db';
import { accountExists, appExists, eventExists, handleError, logEvent, userExists, validatePayload } from '../helper';
import { authValidation } from '../middleware/authValidation';
import { Provider } from '../providers/provider';
import { ErrorGeneric } from '../types';

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
  let failedNotifications = 0;

  await Promise.all(
    event.connectedProviders.map(async (eventProvider) => {
      const provider = await db.provider.get(app.id, eventProvider.providerName);
      if (!provider) return;
      try {
        await providerAPI.send({
          app: app,
          event: event,
          provider: provider,
          user: user,
          message: message,
        });
        await logEvent({ app: app, event: event, message: message, provider: provider, user: user }, 'DELIVERED');
      } catch (e) {
        failedNotifications += 1;
        await logEvent({ app: app, event: event, message: message, provider: provider, user: user }, 'FAILED');
      }
    }),
  );

  if (failedNotifications !== 0)
    throw new ErrorGeneric({ reason: 'FAILURE', explanation: `${failedNotifications} notifications failed to send.` });
};

export const sendEventFromApiKey = async (args: any) => {
  try {
    if (!args?.apiKey) return; // No Api key
    const account = await accountExists(args.apiKey);
    if (!account) return; // Account does not exist

    const payload: sendEventArgs | undefined = validatePayload(
      {
        appName: args?.appName,
        eventName: args?.eventName,
        userWalletAddress: args?.userWalletAddress,
        data: args?.data,
        ownerAddress: account.ownerAddress,
      },
      sendSchema,
    );
    if (payload === undefined) return;
    await sendEventHelper(payload);
  } catch (e) {
    console.log(e);
  }
};

const sendEventFromDashboard = async ({ body, ownerAddress }: Request, res: Response) => {
  try {
    const payload: sendEventArgs | undefined = validatePayload({ ownerAddress: ownerAddress, ...body }, sendSchema);
    if (payload === undefined) return;
    await sendEventHelper(payload);
    res.sendStatus(200);
  } catch (err) {
    return handleError(err, res);
  }
};

router.post('/dashboard', authValidation, sendEventFromDashboard);

export default router;
