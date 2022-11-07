import { PrismaClient, User } from '@prisma/client';
import { createUserArgs, updateUserArgs } from '../../types';

export class UserDB {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(appName: string) {
    return this.prisma.user.findMany({
      where: {
        appName: appName,
      },
      include: {
        telegramData: true,
      },
    });
  }

  async get(appName: string, walletAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        walletAddress_appName: {
          appName: appName,
          walletAddress: walletAddress,
        },
      },
      include: {
        telegramData: true,
      },
    });
    return user;
  }

  async create(appName: string, args: createUserArgs) {
    const user = await this.prisma.user.create({
      data: { appName: appName, ...args },
      include: {
        telegramData: true,
      },
    });

    return user;
  }

  async update(appName: string, walletAddress: string, args: updateUserArgs) {
    const user = await this.prisma.user.upsert({
      where: {
        walletAddress_appName: {
          appName: appName,
          walletAddress: walletAddress,
        },
      },
      update: { ...args },
      create: {
        appName: appName,
        walletAddress: walletAddress,
        ...args,
      },
      include: {
        telegramData: true,
      },
    });
    return user;
  }

  async delete(appName: string, walletAddress: string): Promise<void> {
    await this.prisma.user.deleteMany({
      where: {
        appName: appName,
        walletAddress: walletAddress,
      },
    });
  }

  async addTelegramChatId(
    appName: string,
    walletAddress: string,
    data: {
      providerName: string;
      chatId: string;
    }[],
  ) {
    const dataProcessed = data.map((t) => {
      return {
        appName: appName,
        walletAddress: walletAddress,
        providerName: t.providerName,
        chatId: t.chatId,
      };
    });

    await this.prisma.telegramProvider.createMany({
      data: dataProcessed,
      skipDuplicates: true,
    });

    return this.get(appName, walletAddress);
  }

  async updateTelegramChatId(appName: string, walletAddress: string, providerName: string, chatId: string) {
    await this.prisma.telegramProvider.upsert({
      where: {
        walletAddress_appName_providerName: {
          appName: appName,
          providerName: providerName,
          walletAddress: walletAddress,
        },
      },
      update: {
        chatId: chatId,
      },
      create: {
        appName: appName,
        providerName: providerName,
        chatId: chatId,
        walletAddress: walletAddress,
      },
    });

    return this.get(appName, walletAddress);
  }

  async deleteTelegramChatId(appName: string, walletAddress: string, providerName: string) {
    await this.prisma.telegramProvider.deleteMany({
      where: {
        appName: appName,
        walletAddress: walletAddress,
        providerName: providerName,
      },
    });

    return this.get(appName, walletAddress);
  }
}
