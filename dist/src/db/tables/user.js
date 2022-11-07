"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDB = void 0;
class UserDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(appName) {
        return this.prisma.user.findMany({
            where: {
                appName: appName,
            },
        });
    }
    async get(appName, walletAddress) {
        const user = await this.prisma.user.findUnique({
            where: {
                walletAddress_appName: {
                    appName: appName,
                    walletAddress: walletAddress,
                },
            },
        });
        return user;
    }
    async create(appName, args) {
        const user = await this.prisma.user.create({
            data: { appName: appName, ...args },
        });
        return user;
    }
    async update(appName, walletAddress, args) {
        const user = await this.prisma.user.upsert({
            where: {
                walletAddress_appName: {
                    appName: appName,
                    walletAddress: walletAddress,
                },
            },
            update: { ...args },
            create: {
                appName: appName,
                walletAddress: walletAddress,
                ...args,
            },
        });
        return user;
    }
    async delete(appName, walletAddress) {
        await this.prisma.user.deleteMany({
            where: {
                appName: appName,
                walletAddress: walletAddress,
            },
        });
    }
}
exports.UserDB = UserDB;
