import express, { Request, Response } from 'express';
import { db } from '../db/db';
import { authValidation } from '../middleware/authValidation';

const router = express.Router();

const getAllApps = async (req: Request, res: Response) => {
  const app = await db.app.getAll(req.ownerAddress!);
  return res.status(200).send(app);
};

const createApp = async (req: Request, res: Response) => {
  if (!req.body.appName)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });

  const app = await db.app.create({
    name: req.body.appName,
    description: req.body.description,
    ownerAddress: req.ownerAddress!,
  });

  return res.status(200).send(app);
};

const getApp = async (req: Request, res: Response) => {
  if (!req.params.appName)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });

  const app = await db.app.get(req.params.appName, req.ownerAddress!);
  return res.status(200).send(app);
};

const deleteApp = async (req: Request, res: Response) => {
  if (!req.body.appName)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });

  await db.app.delete(req.body.appName, req.ownerAddress!);
  return res.status(200).send('App Deleted Successfully');
};

router.get('/all', authValidation, getAllApps);
router.get('/:appName', authValidation, getApp);
router.post('/create', authValidation, createApp);
router.post('/delete', authValidation, deleteApp);

export default router;
