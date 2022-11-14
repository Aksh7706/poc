"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const tables_1 = require("./tables");
const log_1 = require("./tables/log");
class DB {
    constructor(prisma) {
        this.account = new tables_1.AccountDB(prisma);
        this.app = new tables_1.AppDB(prisma);
        this.user = new tables_1.UserDB(prisma);
        this.event = new tables_1.EventDB(prisma);
        this.provider = new tables_1.ProviderDB(prisma);
        this.inAppNotification = new tables_1.InAppNotificationDB(prisma);
        this.log = new log_1.LogDB(prisma);
    }
}
const prisma = new client_1.PrismaClient();
exports.db = new DB(prisma);
