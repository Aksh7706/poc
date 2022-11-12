import { PrismaClient } from '@prisma/client';
import { createInappNotificationArgs } from '../../types';

export class InAppNotificationDB {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(appName: string) {
    const notifications = await this.prisma.inAppWebNotifications.findMany({
      where: {
        appName: appName,
      },
    });
    return notifications;
  }

  async get(appName: string, userWalletAddress: string) {
    const notifications = await this.prisma.inAppWebNotifications.findMany({
      where: {
        appName: appName,
        userWalletAdress: userWalletAddress,
      },
    });
    return notifications;
  }

  async create(args: createInappNotificationArgs) {
    const notification = await this.prisma.inAppWebNotifications.create({
      data: args,
    });
    return notification;
  }

  async updateStatus(requestId: string, isRead: boolean) {
    const notification = await this.prisma.inAppWebNotifications.update({
      where: {
        requestId: requestId,
      },
      data: {
        isRead: isRead,
      },
    });
    return notification;
  }

  async delete(requestId: string) {
    await this.prisma.inAppWebNotifications.delete({
      where: {
        requestId: requestId,
      },
    });
  }
}
