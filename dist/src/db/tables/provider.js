"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderDB = void 0;
class ProviderDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(appName, channel, providerType) {
        return this.prisma.provider.findMany({
            where: {
                appName: appName,
                channel: channel,
                providerKey: providerType,
            },
        });
    }
    async get(appName, providerName) {
        const provider = await this.prisma.provider.findUnique({
            where: {
                name_appName: {
                    name: providerName,
                    appName: appName,
                },
            },
        });
        return provider;
    }
    async create(appName, args) {
        const provider = await this.prisma.provider.create({
            data: {
                appName: appName,
                ...args,
            },
        });
        return provider;
    }
    async update(appName, providerName, args) {
        const provider = await this.prisma.provider.upsert({
            where: {
                name_appName: {
                    name: providerName,
                    appName: appName,
                },
            },
            update: { ...args },
            create: {
                name: providerName,
                appName: appName,
                ...args,
            },
        });
        return provider;
    }
    async delete(appName, providerName) {
        await this.prisma.provider.deleteMany({
            where: {
                name: providerName,
                appName: appName,
            },
        });
    }
}
exports.ProviderDB = ProviderDB;
