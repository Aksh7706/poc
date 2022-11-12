import { PrismaClient } from '@prisma/client';
import { AppData, createAppArgs, updateAppArgs } from '../../types';

export class AppDB {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(ownerAddress: string): Promise<AppData[]> {
    return this.prisma.app.findMany({
      where: {
        ownerAddress: ownerAddress,
      },
      include: this.includeRelations(),
    });
  }

  async getById(appId: string): Promise<AppData | null> {
    const app = await this.prisma.app.findUnique({
      where: {
        id: appId,
      },
      include: this.includeRelations(),
    });

    return app;
  }

  async get(appName: string, ownerAddress: string): Promise<AppData | null> {
    const app = await this.prisma.app.findUnique({
      where: {
        name_ownerAddress: {
          name: appName,
          ownerAddress: ownerAddress,
        },
      },
      include: this.includeRelations(),
    });

    return app;
  }

  async create({ name, description, metadata, ownerAddress }: createAppArgs): Promise<AppData> {
    const app = await this.prisma.app.create({
      data: {
        name: name,
        description: description,
        metadata: metadata,
        ownerAddress: ownerAddress,
      },
      include: this.includeRelations(),
    });

    return app;
  }

  async update(
    appName: string,
    ownerAddress: string,
    { description, metadata, name }: updateAppArgs,
  ): Promise<AppData> {
    const app = await this.prisma.app.upsert({
      where: {
        name_ownerAddress: {
          name: appName,
          ownerAddress: ownerAddress,
        },
      },
      update: {
        name: name,
        description: description,
        metadata: metadata,
      },
      create: {
        name: name,
        description: description,
        metadata: metadata,
        ownerAddress: ownerAddress,
      },
      include: this.includeRelations(),
    });

    return app;
  }

  async delete(appName: string, ownerAddress: string): Promise<void> {
    await this.prisma.app.deleteMany({
      where: {
        ownerAddress: ownerAddress,
        name: appName,
      },
    });
  }

  private includeRelations(Event: boolean = true, Provider: boolean = true, User: boolean = true) {
    return {
      Event: Event,
      Provider: Provider,
      User: User,
    };
  }
}
