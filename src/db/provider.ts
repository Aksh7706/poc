import { PrismaClient, Prisma, Provider, Channel, ProviderKey } from '@prisma/client';

const prisma = new PrismaClient();

export class ProviderDB {
  static async getAll(appName: string, channel?: Channel, providerType?: ProviderKey): Promise<Provider[]> {
    let query: { [k: string]: any } = {
      appName: appName,
    };
    if (channel) query['channel'] = channel;
    if (providerType) query['provider_key'] = providerType;

    return prisma.provider.findMany({
      where: query,
    });
  }

  static async getProvider(appName: string, providerName: string): Promise<Provider | null> {
    const provider = await prisma.provider.findUnique({
      where: {
        name_appName: {
          name: providerName,
          appName: appName,
        },
      },
    });

    return provider;
  }

  static async createProvider(appName: string, args: createProviderArgs): Promise<Provider> {
    const provider = await prisma.provider.create({
      data: {
        appName: appName,
        ...args,
      },
    });

    return provider;
  }

  static async updateProvider(appName: string, providerName: string, args: updateProviderArgs): Promise<Provider> {
    const provider = await prisma.provider.upsert({
      where: {
        name_appName: {
          name: providerName,
          appName: appName,
        },
      },
      update: { ...args },
      create: {
        name: providerName,
        appName: appName,
        ...args,
      },
    });

    return provider;
  }

  static async deleteProvider(appName: string, providerName: string): Promise<void> {
    await prisma.provider.delete({
      where: {
        name_appName: {
          name: providerName,
          appName: appName,
        },
      },
    });
  }
}

type createProviderArgs = Omit<Prisma.ProviderCreateInput, 'app' | 'event' | 'id' | 'createdAt' | 'updatedAt'>;
type updateProviderArgs = Omit<Prisma.ProviderCreateInput, 'name' | 'app' | 'event' | 'id' | 'createdAt' | 'updatedAt'>;
