"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDB = void 0;
class EventDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(appName, channel, providerType) {
        return this.prisma.event.findMany({
            where: {
                appName: appName,
                provider: {
                    channel: channel,
                    providerKey: providerType,
                },
            },
            include: {
                provider: true,
            },
        });
    }
    async get(appName, eventName) {
        const event = await this.prisma.event.findUnique({
            where: {
                name_appName: {
                    name: eventName,
                    appName: appName,
                },
            },
            include: {
                provider: true,
            },
        });
        return event;
    }
    async create(appName, args) {
        const event = await this.prisma.event.create({
            data: {
                appName: appName,
                ...args,
            },
            include: {
                provider: true,
            },
        });
        return event;
    }
    async update(appName, eventName, args) {
        const event = await this.prisma.event.upsert({
            where: {
                name_appName: {
                    name: eventName,
                    appName: appName,
                },
            },
            update: { ...args },
            create: {
                appName: appName,
                name: eventName,
                ...args,
            },
            include: {
                provider: true,
            },
        });
        return event;
    }
    async delete(appName, eventName) {
        await this.prisma.event.deleteMany({
            where: {
                name: eventName,
                appName: appName,
            },
        });
    }
}
exports.EventDB = EventDB;
