import express, { Request, Response } from 'express';
import { db } from '../db/db';
import jwt from 'jsonwebtoken';

const router = express.Router();

const login = async (req: Request, res: Response) => {
  if (!req.body.ownerAddress)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'ownerAddress can not be undefined' });

  const ownerAddress = req.body.ownerAddress;
  let account = await db.account.get(ownerAddress);

  if (!account) {
    account = await db.account.create({
      ownerAddress: ownerAddress,
      name: '',
    });
  }

  const token = jwt.sign({ ownerAddress: ownerAddress }, 'YOUR_SECRET_KEY', { expiresIn: '365d' });
  return res
    .cookie('access_token', token, {
      domain: 'localhost',
    })
    .status(200)
    .send(account);
};

const logout = async (req: Request, res: Response) => {
  return res.clearCookie('access_token').sendStatus(200);
};

router.post('/login', login);
router.get('/logout', logout);
export default router;
