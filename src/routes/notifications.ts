import express, { Request, Response } from 'express';
import Joi from 'joi';
import { db } from '../db/db';
import { accountExists, appExists, handleError, validatePayload } from '../helper';

const router = express.Router();

const getNotification = Joi.object({
  apiKey: Joi.string().required(),
  appName: Joi.string().required(),
  userWalletAddress: Joi.string().required(),
});

type GetNotificationArgs = {
  apiKey: string;
  appName: string;
  userWalletAddress: string;
};

const getInAppNotifications = async ({ body }: Request, res: Response) => {
  try {
    const payload: GetNotificationArgs | undefined = validatePayload({ ...body }, getNotification);
    if (payload === undefined) return;
    const account = await accountExists(payload.apiKey);
    const app = await appExists(payload.appName, account.ownerAddress);
    const notifications = await db.inAppNotification.getAll(app.id, payload.userWalletAddress);
    res.status(200).send(notifications);
  } catch (err) {
    return handleError(err, res);
  }
};

router.post('/dapp/in-app', getInAppNotifications);

export default router;
