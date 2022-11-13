import { PrismaClient } from '@prisma/client';
import { AccountDB, AppDB, EventDB, InAppNotificationDB, ProviderDB, UserDB } from './tables';
import { LogDB } from './tables/log';

class DB {
  app: AppDB;
  user: UserDB;
  event: EventDB;
  provider: ProviderDB;
  inAppNotification: InAppNotificationDB;
  account: AccountDB;
  log: LogDB;

  constructor(prisma: PrismaClient) {
    this.account = new AccountDB(prisma);
    this.app = new AppDB(prisma);
    this.user = new UserDB(prisma);
    this.event = new EventDB(prisma);
    this.provider = new ProviderDB(prisma);
    this.inAppNotification = new InAppNotificationDB(prisma);
    this.log = new LogDB(prisma);
  }
}

const prisma = new PrismaClient();
export const db = new DB(prisma);
