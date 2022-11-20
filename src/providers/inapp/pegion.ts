import { App } from '@prisma/client';
import { db } from '../../db/db';
import { SendEventArgs } from '../../types';

export class Pigeon {
  async sendMessage(args: SendEventArgs) {
    const { user, app, data } = args;
    await db.inAppNotification.create({
      appId: app.id,
      isRead: false,
      message: data.message,
      userWalletAdress: user.walletAddress,
    });
  }

  async sendWelcomeMessage(app: App, walletAddress: string) {
    const message = `Thanks for subscribing at ${app.name}.\n We will be sending your on-chain and product notifications here.`;
    await db.inAppNotification
      .create({
        appId: app.id,
        isRead: false,
        message: message,
        userWalletAdress: walletAddress,
      })
      .catch((e) => {});
  }
}
