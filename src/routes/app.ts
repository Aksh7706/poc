import express, { Request, Response } from 'express';
import { db } from '../db/db';

const router = express.Router();

const createApp = async (req: Request, res: Response) => {
  if (!req.body.name)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });

  const app = await db.app.create({
    name: req.body.name,
    description: req.body.description,
  });

  return res.status(200).send(app);
};

const getApp = async (req: Request, res: Response) => {
  if (!req.params.appName)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });

  const app = await db.app.get(req.params.appName);
  return res.status(200).send(app);
};

const deleteApp = async (req: Request, res: Response) => {
  if (!req.body.name)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });

  await db.app.delete(req.body.name);
  return res.status(200).send('App Deleted Successfully');
};

router.get('/:appName', getApp);
router.post('/create', createApp);
router.post('/delete', deleteApp);

export default router;
