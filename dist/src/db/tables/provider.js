"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderDB = void 0;
class ProviderDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(appId, channel, providerType) {
        return this.prisma.provider.findMany({
            where: {
                appId: appId,
                channel: channel,
                providerKey: providerType,
            },
            include: {
                EventProviders: true,
            },
        });
    }
    async get(appId, providerName) {
        const provider = await this.prisma.provider.findUnique({
            where: {
                name_appId: {
                    name: providerName,
                    appId: appId,
                },
            },
            include: {
                EventProviders: true,
            },
        });
        return provider;
    }
    async create(appId, args) {
        const provider = await this.prisma.provider.create({
            data: {
                appId: appId,
                ...args,
            },
            include: {
                EventProviders: true,
            },
        });
        return provider;
    }
    async update(appId, providerName, args) {
        const provider = await this.prisma.provider.upsert({
            where: {
                name_appId: {
                    name: providerName,
                    appId: appId,
                },
            },
            update: { ...args },
            create: {
                name: providerName,
                appId: appId,
                ...args,
            },
            include: {
                EventProviders: true,
            },
        });
        return provider;
    }
    async delete(appId, providerName) {
        await this.prisma.provider.deleteMany({
            where: {
                name: providerName,
                appId: appId,
            },
        });
    }
    async getConnectedEvents(appId, providerName) {
        const events = await this.prisma.eventProviders.findMany({
            where: {
                appId: appId,
                providerName: providerName,
            },
            include: {
                Event: true,
            },
        });
        return events;
    }
}
exports.ProviderDB = ProviderDB;
