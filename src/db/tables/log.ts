import { Prisma, PrismaClient } from '@prisma/client';

export class LogDB {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(args: Prisma.NotificationLogsUncheckedCreateInput) {
    await this.prisma.notificationLogs.create({
      data: {
        ...args,
      },
    });
  }
}
