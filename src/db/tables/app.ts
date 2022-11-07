import { PrismaClient } from '@prisma/client';
import { AppData, createAppArgs, updateAppArgs } from '../../types';

export class AppDB {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<AppData[]> {
    return this.prisma.app.findMany({
      include: this.includeRelations(),
    });
  }

  async get(appName: string): Promise<AppData | null> {
    const app = await this.prisma.app.findUnique({
      where: {
        name: appName,
      },
      include: this.includeRelations(),
    });

    return app;
  }

  async create({ name, description, metadata }: createAppArgs): Promise<AppData> {
    const app = await this.prisma.app.create({
      data: {
        name: name,
        description: description,
        metadata: metadata,
      },
      include: this.includeRelations(),
    });

    return app;
  }

  async update(appName: string, { description, metadata }: updateAppArgs): Promise<AppData> {
    const app = await this.prisma.app.upsert({
      where: {
        name: appName,
      },
      update: {
        description: description,
        metadata: metadata,
      },
      create: {
        name: appName,
        description: description,
        metadata: metadata,
      },
      include: this.includeRelations(),
    });

    return app;
  }

  async delete(appName: string): Promise<void> {
    await this.prisma.app.deleteMany({
      where: {
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
