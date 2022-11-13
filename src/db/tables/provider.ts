import { PrismaClient, Provider, Channel, ProviderKey } from '@prisma/client';
import { createProviderArgs, updateProviderArgs } from '../../types';

export class ProviderDB {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(appId: string, channel?: Channel, providerType?: ProviderKey): Promise<Provider[]> {
    return this.prisma.provider.findMany({
      where: {
        appId: appId,
        channel: channel,
        providerKey: providerType,
      },
      include: {
        EventProviders: true,
      },
    });
  }

  async get(appId: string, providerName: string): Promise<Provider | null> {
    const provider = await this.prisma.provider.findUnique({
      where: {
        name_appId: {
          name: providerName,
          appId: appId,
        },
      },
      include: {
        EventProviders: true,
      },
    });

    return provider;
  }

  async create(appId: string, args: createProviderArgs): Promise<Provider> {
    const provider = await this.prisma.provider.create({
      data: {
        appId: appId,
        ...args,
      },
      include: {
        EventProviders: true,
      },
    });

    return provider;
  }

  async update(appId: string, providerName: string, args: updateProviderArgs): Promise<Provider> {
    const provider = await this.prisma.provider.upsert({
      where: {
        name_appId: {
          name: providerName,
          appId: appId,
        },
      },
      update: { ...args },
      create: {
        name: providerName,
        appId: appId,
        ...args,
      },
      include: {
        EventProviders: true,
      },
    });

    return provider;
  }

  async delete(appId: string, providerName: string): Promise<void> {
    await this.prisma.provider.deleteMany({
      where: {
        name: providerName,
        appId: appId,
      },
    });
  }

  async getConnectedEvents(appId: string, providerName: string) {
    const events = await this.prisma.eventProviders.findMany({
      where: {
        appId: appId,
        providerName: providerName,
      },
      include: {
        Event: true,
      },
    });

    return events;
  }
}
