import express, { Request, Response } from 'express';
import { db } from '../db/db';
import { checkUniqueApp, handleError } from '../helper';
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

const updateApp = async (req: Request, res: Response) => {
  if (!req.body.appName || !req.body.updatedAppName)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });
  try {
    await checkUniqueApp(req.body.updatedAppName, req.ownerAddress!);
    const app = await db.app.update(req.body.appName, req.ownerAddress!, { name: req.body.updatedAppName });
    return res.status(200).send(app);
  } catch (err) {
    return handleError(err, res);
  }
};

const getApp = async ({ body, ownerAddress }: Request, res: Response) => {
  if (!body.appName)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });

  const app = await db.app.get(body.appName, ownerAddress!);
  return res.status(200).send(app);
};

const deleteApp = async (req: Request, res: Response) => {
  if (!req.body.appName)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });

  await db.app.delete(req.body.appName, req.ownerAddress!);
  return res.status(200).send('App Deleted Successfully');
};

router.get('/getAll', authValidation, getAllApps);
router.post('/get', authValidation, getApp);
router.post('/update', authValidation, updateApp);
router.post('/create', authValidation, createApp);
router.post('/delete', authValidation, deleteApp);

export default router;
