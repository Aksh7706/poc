"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.prismaClient = void 0;
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
class PrismaHelper {
    static getPrisma() {
        //verify if prisma instance not exist
        if (this.Prisma === null || !this.Prisma)
            //create new one
            this.Prisma = new client_1.PrismaClient();
        return this.Prisma;
    }
}
exports.prismaClient = PrismaHelper.getPrisma();
exports.db = new DB(exports.prismaClient);
