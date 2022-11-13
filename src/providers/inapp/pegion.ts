import { db } from '../../db/db';
import { SendEventArgs } from '../../types';

export class Pigeon {
  async sendMessage(args: SendEventArgs) {
    const { user, app, message } = args;
    await db.inAppNotification.create({
      appId: app.id,
      isRead: false,
      message: message,
      userWalletAdress: user.walletAddress,
    });
  }
}
