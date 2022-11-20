"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogDB = void 0;
class LogDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(args) {
        await this.prisma.notificationLogs.create({
            data: {
                ...args,
            },
        });
    }
}
exports.LogDB = LogDB;
