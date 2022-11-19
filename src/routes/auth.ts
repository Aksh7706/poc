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
      contractAddress: req.body.ownerAddress
    });

    const template = `<p>You invoked the method <strong>&quot;{{methodName}}&quot;</strong> on <strong>&quot;{{contractAddress}}&quot;</strong>.</p><p><br></p><p>Please find more details at {{txUrl}}.</p>`
    const app = await db.app.create({name: "Demo App", ownerAddress: account.ownerAddress});
    const event = await db.event.create(app.id, {
      name: "Generic",
      template: {
        IN_APP: {
          message: template
        }
      },
      metadata: {
        channels: "IN_APP",
        onChain: "true"
      }
    })

    const provider =  await db.provider.create(app.id, {
      channel: 'IN_APP',
      name: 'Demo In App',
      providerKey: 'PIGEON',
    })

    await db.event.connectProvider(app.id, event.name, provider.name);
  }

  const token = jwt.sign({ ownerAddress: ownerAddress }, 'YOUR_SECRET_KEY', { expiresIn: '365d' });
  return res
    .cookie('access_token', token, { sameSite: 'none', secure: true})
    .status(200)
    .send(account);
};

const logout = async (req: Request, res: Response) => {
  return res.clearCookie('access_token').sendStatus(200);
};

router.post('/login', login);
router.get('/logout', logout);
export default router;
