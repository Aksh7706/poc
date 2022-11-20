"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDB = void 0;
class EventDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(appId, channel, providerType) {
        return this.prisma.event.findMany({
            where: {
                appId: appId,
            },
            include: {
                connectedProviders: true,
            },
        });
    }
    async get(appId, eventName) {
        const event = await this.prisma.event.findUnique({
            where: {
                name_appId: {
                    appId: appId,
                    name: eventName
                }
            },
            include: {
                connectedProviders: true,
            },
        });
        return event;
    }
    async create(appId, args) {
        const event = await this.prisma.event.create({
            data: {
                appId: appId,
                ...args,
            },
            include: {
                connectedProviders: true,
            },
        });
        return event;
    }
    async update(appId, eventName, args) {
        const event = await this.prisma.event.upsert({
            where: {
                name_appId: {
                    appId: appId,
                    name: eventName
                }
            },
            update: { ...args },
            create: {
                appId: appId,
                name: eventName,
                ...args,
            },
            include: {
                connectedProviders: true,
            },
        });
        return event;
    }
    async delete(appId, eventName) {
        await this.prisma.event.deleteMany({
            where: {
                name: eventName,
                appId: appId,
            },
        });
    }
    async connectProvider(appId, eventName, providerName) {
        const connectedProvider = await this.prisma.eventProviders.create({
            data: {
                appId: appId,
                eventName: eventName,
                providerName: providerName,
            },
            include: {
                Event: true,
                provider: true,
            },
        });
        return connectedProvider;
    }
    async disconnectAllProvider(appId, eventName) {
        await this.prisma.eventProviders.deleteMany({
            where: {
                appId: appId,
                eventName: eventName,
            },
        });
    }
    async disconnectProvider(appId, eventName, providerName) {
        await this.prisma.eventProviders.deleteMany({
            where: {
                appId: appId,
                eventName: eventName,
                providerName: providerName,
            },
        });
    }
    async getConnectedProviders(appId, eventName) {
        const connectedProviders = await this.prisma.eventProviders.findMany({
            where: {
                appId: appId,
                eventName: eventName,
            },
            include: {
                provider: true,
            },
        });
        return connectedProviders;
    }
}
exports.EventDB = EventDB;
