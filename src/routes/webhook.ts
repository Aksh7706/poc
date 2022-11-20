import express, { Request, Response } from 'express';
import { db } from '../db/db';
import { Telegram } from '../providers/other/telegram';
import { Base64 } from '../utils/base64';
const router = express.Router();

router.post('/webhook/:appId/:providerName', async ({ params, body }: Request, res: Response) => {
  const appId = params.appId;
  const providerName = params.providerName;

  if (!appId || !providerName) return res.sendStatus(200);

  const app = await db.app.getById(appId);
  const provider = await db.provider.get(appId, providerName);

  if (!app || !provider) return res.sendStatus(200); // if app or provider does not exist
  if (provider.providerKey !== 'TELEGRAM') return res.sendStatus(200); // TODO: Make hook more generalized

  const message: string = body?.message?.text ?? '';

  console.log('Message : ', message);
  const msgArray = message.split(' ');
  const chatId: number | undefined = body?.message?.chat?.id;
  console.log('Message Array:', msgArray);
  if (msgArray.length === 2 && msgArray[0] === '/start' && chatId) {
    const encodedWalletAddress = msgArray[1]; // TODO: add method to validate isWalletAddress
    if (!encodedWalletAddress) return res.sendStatus(200);

    try {
      const walletAddress = Base64.decode(encodedWalletAddress);
      console.log('Wallet Address : ', walletAddress);
      let user = await db.user.get(appId, walletAddress);
      if (!user) {
        user = await db.user.create(appId, {
          walletAddress: walletAddress,
          telegramData: {
            create: {
              chatId: chatId.toString(),
              providerName: providerName,
            },
          },
        });
      } else {
        user = await db.user.updateTelegramChatId(appId, walletAddress, providerName, chatId.toString());
      }
      const telegramProvider = new Telegram();
      await telegramProvider.sendWelcomeMessage(provider, chatId.toString(), app.name);
      console.log('User : ', user);
    } catch (e) {
      console.log('Error telegram : ', e);
    }
  }

  return res.sendStatus(200);
});

export default router;
