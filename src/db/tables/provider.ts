import { PrismaClient, Provider, Channel, ProviderKey } from '@prisma/client';
import { createProviderArgs, updateProviderArgs } from '../../types';

export class ProviderDB {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(appName: string, channel?: Channel, providerType?: ProviderKey): Promise<Provider[]> {
    return this.prisma.provider.findMany({
      where: {
        appName: appName,
        channel: channel,
        providerKey: providerType,
      },
    });
  }

  async get(appName: string, providerName: string): Promise<Provider | null> {
    const provider = await this.prisma.provider.findUnique({
      where: {
        name_appName: {
          name: providerName,
          appName: appName,
        },
      },
    });

    return provider;
  }

  async create(appName: string, args: createProviderArgs): Promise<Provider> {
    const provider = await this.prisma.provider.create({
      data: {
        appName: appName,
        ...args,
      },
    });

    return provider;
  }

  async update(appName: string, providerName: string, args: updateProviderArgs): Promise<Provider> {
    const provider = await this.prisma.provider.upsert({
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

  async delete(appName: string, providerName: string): Promise<void> {
    await this.prisma.provider.deleteMany({
      where: {
        name: providerName,
        appName: appName,
      },
    });
  }

  async getConnectedEvents(appName: string, providerName: string) {
    const events = await this.prisma.eventProviders.findMany({
      where: {
        appName: appName,
        providerName: providerName,
      },
      include: {
        Event: true,
      },
    });

    return events;
  }
}
