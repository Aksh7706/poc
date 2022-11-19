import express, { Request, Response } from 'express';
import { db } from '../db/db';
import { authValidation } from '../middleware/authValidation';

const router = express.Router();

const getAccount = async (req: Request, res: Response) => {
  if (!req.ownerAddress)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'Something went wrong.' });

  const account = await db.account.get(req.ownerAddress);
  return res.status(200).send(account);
};

const updateAccount = async (req: Request, res: Response) => {
  if (!req.ownerAddress || !req.body.accountName || !req.body.contractAddress)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'Something went wrong.' });

  const account = await db.account.update(req.ownerAddress, {
    name: req.body.accountName,
    contractAddress: req.body.contractAddress,
  });
  return res.status(200).send(account);
};

const deleteAccount = async (req: Request, res: Response) => {
  if (!req.ownerAddress)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'Something went wrong.' });

  await db.account.delete(req.ownerAddress);
  return res.sendStatus(200);
};

router.get('/', authValidation, getAccount);
router.post('/update', authValidation, updateAccount);
router.get('/delete', authValidation, deleteAccount);

export default router;
