import { PrismaClient, User } from '@prisma/client';
import { createUserArgs, updateUserArgs } from '../../types';

export class UserDB {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(appId: string) {
    return this.prisma.user.findMany({
      where: {
        appId: appId,
      },
      include: {
        telegramData: true,
      },
    });
  }

  async get(appId: string, walletAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        walletAddress_appId: {
          appId: appId,
          walletAddress: walletAddress,
        },
      },
      include: {
        telegramData: true,
      },
    });
    return user;
  }

  async create(appId: string, args: createUserArgs) {
    const user = await this.prisma.user.create({
      data: { appId: appId, ...args },
      include: {
        telegramData: true,
      },
    });

    return user;
  }

  async update(appId: string, walletAddress: string, args: updateUserArgs) {
    const user = await this.prisma.user.upsert({
      where: {
        walletAddress_appId: {
          appId: appId,
          walletAddress: walletAddress,
        },
      },
      update: { ...args },
      create: {
        appId: appId,
        walletAddress: walletAddress,
        ...args,
      },
      include: {
        telegramData: true,
      },
    });
    return user;
  }

  async delete(appId: string, walletAddress: string): Promise<void> {
    await this.prisma.user.deleteMany({
      where: {
        appId: appId,
        walletAddress: walletAddress,
      },
    });
  }

  async addTelegramChatId(
    appId: string,
    walletAddress: string,
    data: {
      providerName: string;
      chatId: string;
    }[],
  ) {
    const dataProcessed = data.map((t) => {
      return {
        appId: appId,
        walletAddress: walletAddress,
        providerName: t.providerName,
        chatId: t.chatId,
      };
    });

    await this.prisma.telegramProvider.createMany({
      data: dataProcessed,
      skipDuplicates: true,
    });

    return this.get(appId, walletAddress);
  }

  async updateTelegramChatId(appId: string, walletAddress: string, providerName: string, chatId: string) {
    await this.prisma.telegramProvider.upsert({
      where: {
        walletAddress_appId_providerName: {
          appId: appId,
          providerName: providerName,
          walletAddress: walletAddress,
        },
      },
      update: {
        chatId: chatId,
      },
      create: {
        appId: appId,
        providerName: providerName,
        chatId: chatId,
        walletAddress: walletAddress,
      },
    });

    return this.get(appId, walletAddress);
  }

  async deleteTelegramChatId(appId: string, walletAddress: string, providerName: string) {
    await this.prisma.telegramProvider.deleteMany({
      where: {
        appId: appId,
        walletAddress: walletAddress,
        providerName: providerName,
      },
    });

    return this.get(appId, walletAddress);
  }
}
