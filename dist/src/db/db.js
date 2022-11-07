"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
const tables_1 = require("./tables");
class DB {
    constructor(prisma) {
        this.app = new tables_1.AppDB(prisma);
        this.user = new tables_1.UserDB(prisma);
        this.event = new tables_1.EventDB(prisma);
        this.provider = new tables_1.ProviderDB(prisma);
    }
}
const prisma = new client_1.PrismaClient();
exports.db = new DB(prisma);
