import { db } from '../../db/db';
import { SendEventArgs } from '../../types';

export class Pigeon {
  async sendMessage({ user, app, event, message }: SendEventArgs) {
    await db.inAppNotification.create({
      appName: app.name,
      isRead: false,
      message: message,
      userWalletAdress: user.walletAddress,
    });
  }
}
