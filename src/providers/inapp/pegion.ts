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
}
