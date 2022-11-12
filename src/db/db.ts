import { PrismaClient } from '@prisma/client';
import { AccountDB, AppDB, EventDB, InAppNotificationDB, ProviderDB, UserDB } from './tables';

class DB {
  app: AppDB;
  user: UserDB;
  event: EventDB;
  provider: ProviderDB;
  inAppNotification: InAppNotificationDB;
  account: AccountDB;

  constructor(prisma: PrismaClient) {
    this.account = new AccountDB(prisma);
    this.app = new AppDB(prisma);
    this.user = new UserDB(prisma);
    this.event = new EventDB(prisma);
    this.provider = new ProviderDB(prisma);
    this.inAppNotification = new InAppNotificationDB(prisma);
  }
}

const prisma = new PrismaClient();
export const db = new DB(prisma);
