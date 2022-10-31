import { PrismaClient, Prisma, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserDB {
  static async getAll(appName: string): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        appName: appName,
      },
    });
  }

  static async getUser(appName: string, walletAddress: string): Promise<User | null> {
    const user = prisma.user.findUnique({
      where: {
        walletAddress_appName: {
          appName: appName,
          walletAddress: walletAddress,
        },
      },
    });
    return user;
  }

  static async createUser(appName: string, args: createUserArgs): Promise<User> {
    const user = await prisma.user.create({
      data: { appName: appName, ...args },
    });

    return user;
  }

  static async updateUser(appName: string, walletAddress: string, args: updateUserArgs): Promise<User> {
    const user = await prisma.user.upsert({
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
    });
    return user;
  }

  static async deleteUser(appName: string, walletAddress: string): Promise<void> {
    await prisma.user.delete({
      where: {
        walletAddress_appName: {
          appName: appName,
          walletAddress: walletAddress,
        },
      },
    });
  }
}

type createUserArgs = Omit<Prisma.UserUncheckedCreateInput, 'appName' | 'createdAt' | 'updatedAt' | 'id'>;
type updateUserArgs = Omit<createUserArgs, 'walletAddress'>;
