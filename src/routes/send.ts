import { Channel } from '@prisma/client';
import express, { Request, Response } from 'express';
import Handlebars from 'handlebars';
import Joi from 'joi';
import { db, prismaClient } from '../db/db';
import { accountExists, appExists, eventExists, handleError, logEvent, userExists, validatePayload } from '../helper';
import { authValidation, omniAuthValidation } from '../middleware/authValidation';
import { Provider } from '../providers/provider';
import { ErrorGeneric, SendEventArgsData } from '../types';

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
  txHash: Joi.string().optional(),
  data: Joi.object().optional(),
});

export const sendEventHelper = async ({ appName, eventName, userWalletAddress, data, ownerAddress }: sendEventArgs) => {
  const providerAPI = new Provider(prismaClient);

  const app = await appExists(appName, ownerAddress);
  const user = await userExists(app.id, userWalletAddress);
  const event = await eventExists(app.id, eventName);
  const template = event.template as Record<string, Record<string,string>>;

  let failedNotifications = 0;

  await Promise.all(
    event.connectedProviders.map(async (eventProvider) => {
      const provider = await db.provider.get(app.id, eventProvider.providerName);
      if (!provider) return;

      const providerTemplate = template[provider.channel];

      const parsedMsg = Handlebars.compile(providerTemplate?.message ?? '');
      const message = parsedMsg(data);
    
      const parsedSubject = Handlebars.compile(providerTemplate?.subject ?? '');
      const subject = parsedSubject(data);
    
      const parsedData: SendEventArgsData = {
        message: message,
        subject: subject,
      };

      try {
        await providerAPI.send({
          app: app,
          event: event,
          provider: provider,
          user: user,
          data: parsedData,
        });
        await logEvent({ app: app, event: event, data: parsedData, provider: provider, user: user }, 'DELIVERED');
      } catch (e) {
        failedNotifications += 1;
        await logEvent({ app: app, event: event, data: parsedData, provider: provider, user: user }, 'FAILED');
      }
    }),
  );

  if (failedNotifications !== 0)
    throw new ErrorGeneric({ reason: 'FAILURE', explanation: `${failedNotifications} notifications failed to send.` });
};

export const sendEventFromParser = async (args: any) => {
  try {
    let account;

    if (args?.apiKey) {
      account = await accountExists(args.apiKey);
    }

    if(!account && args?.contractAddress){
      account = await db.account.getByContractAddress(args.contractAddress)
    }
    
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
  } catch (err) {
    if (err instanceof Error) {
      console.log("Erorr : ", err?.message);
    }
  }
};

const sendEvent = async ({ body, ownerAddress }: Request, res: Response) => {
  try {
    const payload: sendEventArgs | undefined = validatePayload({ ownerAddress: ownerAddress, ...body }, sendSchema);
    if (payload === undefined) return;
    await sendEventHelper(payload);
    res.sendStatus(200);
  } catch (err) {
    return handleError(err, res);
  }
};

router.post('/', omniAuthValidation, sendEvent);

export default router;
