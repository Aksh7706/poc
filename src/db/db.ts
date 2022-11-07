import { PrismaClient } from '@prisma/client';
import { AppDB, EventDB, ProviderDB, UserDB } from './tables';

class DB {
  app: AppDB;
  user: UserDB;
  event: EventDB;
  provider: ProviderDB;

  constructor(prisma: PrismaClient) {
    this.app = new AppDB(prisma);
    this.user = new UserDB(prisma);
    this.event = new EventDB(prisma);
    this.provider = new ProviderDB(prisma);
  }
}

const prisma = new PrismaClient();
export const db = new DB(prisma);
