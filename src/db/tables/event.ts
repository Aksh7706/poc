import { PrismaClient, Event, Channel, ProviderKey} from '@prisma/client';
import { createEventArgs, updateEventArgs } from '../../types';

export class EventDB {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(appName: string, channel?: Channel, providerType?: ProviderKey): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        appName: appName,
      },
    });
  }

  async get(appName: string, eventName: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        name_appName: {
          name: eventName,
          appName: appName,
        },
      },
      include: {
        connectedProviders: true,
      },
    });
    return event;
  }

  async create(appName: string, args: createEventArgs): Promise<Event> {
    const event = await this.prisma.event.create({
      data: {
        appName: appName,
        ...args,
      },
      include: {
        connectedProviders: true,
      },
    });

    return event;
  }

  async update(appName: string, eventName: string, args: updateEventArgs): Promise<Event> {
    const event = await this.prisma.event.upsert({
      where: {
        name_appName: {
          name: eventName,
          appName: appName,
        },
      },
      update: { ...args },
      create: {
        appName: appName,
        name: eventName,
        ...args,
      },
      include: {
        connectedProviders: true,
      },
    });

    return event;
  }

  async delete(appName: string, eventName: string): Promise<void> {
    await this.prisma.event.deleteMany({
      where: {
        name: eventName,
        appName: appName,
      },
    });
  }

  async connectProvider(appName: string, eventName: string, providerName: string) {
    const connectedProvider = await this.prisma.eventProviders.create({
      data: {
        appName: appName,
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

  async disconnectProvider(appName: string, eventName: string, providerName: string) {
    await this.prisma.eventProviders.deleteMany({
      where: {
        appName: appName,
        eventName: eventName,
        providerName: providerName,
      },
    });
  }

  async getConnectedProviders(appName: string, eventName: string) {
    const connectedProviders = await this.prisma.eventProviders.findMany({
      where: {
        appName: appName,
        eventName: eventName,
      },
      include: {
        provider: true,
      },
    });

    return connectedProviders;
  }
}
