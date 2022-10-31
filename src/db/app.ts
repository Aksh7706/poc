import { App, PrismaClient, Prisma, Provider, User, Event } from '@prisma/client';

const prisma = new PrismaClient();

export class AppDB {
  static async getAllApps(): Promise<AppData[]> {
    return prisma.app.findMany({
      include: this.includeRelations(),
    });
  }

  static async getApp(appName: string): Promise<AppData | null> {
    const app = await prisma.app.findUnique({
      where: {
        name: appName,
      },
      include: this.includeRelations(),
    });

    return app;
  }

  static async createApp({ name, description, metadata }: createAppArgs): Promise<AppData> {
    const app = await prisma.app.create({
      data: {
        name: name,
        description: description,
        metadata: metadata,
      },
      include: this.includeRelations(),
    });

    return app;
  }

  static async updateApp(appName: string, { description, metadata }: updateAppArgs): Promise<AppData> {
    const app = await prisma.app.upsert({
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

  static async deleteApp(appName: string): Promise<void> {
    await prisma.app.delete({
      where: {
        name: appName,
      },
    });
  }

  private static includeRelations(Event: boolean = true, Provider: boolean = true, User: boolean = true) {
    return {
      Event: Event,
      Provider: Provider,
      User: User,
    };
  }
}

type createAppArgs = Pick<Prisma.AppCreateInput, 'name' | 'description' | 'metadata'>;
type updateAppArgs = Pick<Prisma.AppCreateInput, 'description' | 'metadata'>;

type AppData = App & {
  User: User[];
  Event: Event[];
  Provider: Provider[];
};
