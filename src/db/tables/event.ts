import { PrismaClient, Event, Channel, ProviderKey} from '@prisma/client';
import { createEventArgs, updateEventArgs } from '../../types';

export class EventDB {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(appId: string, channel?: Channel, providerType?: ProviderKey) {
    return this.prisma.event.findMany({
      where: {
        appId: appId,
      },
      include: {
        connectedProviders: true,
      },
    });
  }

  async get(appId: string, eventName: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        name_appId: {
          appId: appId,
          name: eventName
        }
      },
      include: {
        connectedProviders: true,
      },
    });
    return event;
  }

  async create(appId: string, args: createEventArgs): Promise<Event> {
    const event = await this.prisma.event.create({
      data: {
        appId: appId,
        ...args,
      },
      include: {
        connectedProviders: true,
      },
    });

    return event;
  }

  async update(appId: string, eventName: string, args: updateEventArgs): Promise<Event> {
    const event = await this.prisma.event.upsert({
      where: {
        name_appId: {
          appId: appId,
          name: eventName
        }
      },
      update: { ...args },
      create: {
        appId: appId,
        name: eventName,
        ...args,
      },
      include: {
        connectedProviders: true,
      },
    });

    return event;
  }

  async delete(appId: string, eventName: string): Promise<void> {
    await this.prisma.event.deleteMany({
      where: {
        name: eventName,
        appId: appId,
      },
    });
  }

  async connectProvider(appId: string, eventName: string, providerName: string) {
    const connectedProvider = await this.prisma.eventProviders.create({
      data: {
        appId: appId,
        eventName: eventName,
        providerName: providerName,
      },
      include: {
        Event: true,
        provider: true,
      },
    });
    return connectedProvider;
  }

  async disconnectProvider(appId: string, eventName: string, providerName: string) {
    await this.prisma.eventProviders.deleteMany({
      where: {
        appId: appId,
        eventName: eventName,
        providerName: providerName,
      },
    });
  }

  async getConnectedProviders(appId: string, eventName: string) {
    const connectedProviders = await this.prisma.eventProviders.findMany({
      where: {
        appId: appId,
        eventName: eventName,
      },
      include: {
        provider: true,
      },
    });

    return connectedProviders;
  }
}
