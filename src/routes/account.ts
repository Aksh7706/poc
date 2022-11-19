import express, { Request, Response } from 'express';
import { db } from '../db/db';
import { generateProject } from '../generator';
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

const setUpAccount = async (req: Request, res: Response) => {
  if (!req.ownerAddress || !req.body.accountName || !req.body.contractAddress)
    return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'Something went wrong.' });

  const account = await db.account.update(req.ownerAddress, {
    name: req.body.accountName,
    contractAddress: req.body.contractAddress,
  });

  const appName = 'Demo App';
  const template = `<p>You invoked the method <strong>&quot;{{methodName}}&quot;</strong> on <strong>&quot;{{contractAddress}}&quot;</strong>.</p><p><br></p><p>Please find more details at {{txUrl}}.</p>`;
  const app = await db.app.create({ name: appName, ownerAddress: account.ownerAddress });
  const event = await db.event.create(app.id, {
    name: 'Generic',
    template: {
      IN_APP: {
        message: template,
      },
    },
    metadata: {
      channels: 'IN_APP',
      onChain: 'true',
    },
  });

  const provider = await db.provider.create(app.id, {
    channel: 'IN_APP',
    name: 'Demo In App',
    providerKey: 'PIGEON',
  });

  await db.event.connectProvider(app.id, event.name, provider.name);
  await generateProject(appName, req.body.contractAddress);
  return res.status(200).send(account);
};

router.get('/', authValidation,  getAccount);
router.post('/update', authValidation, updateAccount);
router.get('/delete', authValidation, deleteAccount);
router.get('/setup', authValidation, setUpAccount);

export default router;
