"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDB = void 0;
class UserDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(appId) {
        return this.prisma.user.findMany({
            where: {
                appId: appId,
            },
            include: {
                telegramData: true,
            },
        });
    }
    async get(appId, walletAddress) {
        const user = await this.prisma.user.findUnique({
            where: {
                walletAddress_appId: {
                    appId: appId,
                    walletAddress: walletAddress,
                },
            },
            include: {
                telegramData: true,
            },
        });
        return user;
    }
    async create(appId, args) {
        const user = await this.prisma.user.create({
            data: { appId: appId, ...args },
            include: {
                telegramData: true,
            },
        });
        return user;
    }
    async update(appId, walletAddress, args) {
        const user = await this.prisma.user.upsert({
            where: {
                walletAddress_appId: {
                    appId: appId,
                    walletAddress: walletAddress,
                },
            },
            update: { ...args },
            create: {
                appId: appId,
                walletAddress: walletAddress,
                ...args,
            },
            include: {
                telegramData: true,
            },
        });
        return user;
    }
    async delete(appId, walletAddress) {
        await this.prisma.user.deleteMany({
            where: {
                appId: appId,
                walletAddress: walletAddress,
            },
        });
    }
    async addTelegramChatId(appId, walletAddress, data) {
        const dataProcessed = data.map((t) => {
            return {
                appId: appId,
                walletAddress: walletAddress,
                providerName: t.providerName,
                chatId: t.chatId,
            };
        });
        await this.prisma.telegramProvider.createMany({
            data: dataProcessed,
            skipDuplicates: true,
        });
        return this.get(appId, walletAddress);
    }
    async updateTelegramChatId(appId, walletAddress, providerName, chatId) {
        await this.prisma.telegramProvider.upsert({
            where: {
                walletAddress_appId_providerName: {
                    appId: appId,
                    providerName: providerName,
                    walletAddress: walletAddress,
                },
            },
            update: {
                chatId: chatId,
            },
            create: {
                appId: appId,
                providerName: providerName,
                chatId: chatId,
                walletAddress: walletAddress,
            },
        });
        return this.get(appId, walletAddress);
    }
    async deleteTelegramChatId(appId, walletAddress, providerName) {
        await this.prisma.telegramProvider.deleteMany({
            where: {
                appId: appId,
                walletAddress: walletAddress,
                providerName: providerName,
            },
        });
        return this.get(appId, walletAddress);
    }
}
exports.UserDB = UserDB;
