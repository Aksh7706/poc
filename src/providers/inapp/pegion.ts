import { db } from '../../db/db';
import { SendEventArgs } from '../../types';

export class Pigeon {
  async sendMessage({ user, app, event }: SendEventArgs) {
    await db.inAppNotification.create({
      appName: app.name,
      isRead: false,
      message: event.template,
      userWalletAdress: user.walletAddress,
    });
  }
}
