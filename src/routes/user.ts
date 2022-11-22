import express, { Request, Response } from 'express';
import { db } from '../db/db';
import { appExists, handleError } from '../helper';
import { omniAuthValidation } from '../middleware/authValidation';
import { Pigeon } from '../providers/inapp/pegion';
import { RedisHelper as redisHelper } from '../reddis';
import { Base64 } from '../utils/base64';

const router = express.Router();

const getAllUsers = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(body.appName, ownerAddress!);
    const user = await db.user.getAll(app.id);
    return res.status(200).send(user);
  } catch (err) {
    return handleError(err, res);
  }
};

const getUser = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName || !body.walletAddress) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(body.appName, ownerAddress!);
    const user = await db.user.get(app.id, body.walletAddress);
    return res.status(200).send(user);
  } catch (err) {
    return handleError(err, res);
  }
};

const upsertUser = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName || !body.walletAddress) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const app = await appExists(body.appName, ownerAddress!);
    const userCheck = await db.user.get(app.id, ownerAddress!);

    const user = await db.user.update(app.id, body.walletAddress, {
      email: body.email,
      mobile: body.mobile,
    });

    if(!userCheck) {
      const pegionProvider = new Pigeon();
      await pegionProvider.sendWelcomeMessage(app, body.walletAddress);
    }

    return res.status(200).send(user);
  } catch (err) {
    return handleError(err, res);
  }
};

const getTelegramInvite = async ({ body }: Request, res: Response) => {
  //https://telegram.me/Staging00Bot?start=aksh=jj__w--xj=hhb==
  if (!body.botUserName || !body.walletAddress) return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  try {
    const otp = await redisHelper.createOTP(body.walletAddress);
    const inviteLink = `https://telegram.me/${body.botUserName}?start=${otp}`;
    return res.status(200).send({
      url: inviteLink,
    });
  } catch (e) {
    return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
  }
};

router.post('/get', omniAuthValidation, getUser);
router.post('/getAll', omniAuthValidation, getAllUsers);
router.post('/upsert', omniAuthValidation, upsertUser);
router.post('/getTelegramInvite', getTelegramInvite);
export default router;
