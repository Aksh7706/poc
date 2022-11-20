"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDB = void 0;
class AppDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(ownerAddress) {
        return this.prisma.app.findMany({
            where: {
                ownerAddress: ownerAddress,
            },
            include: this.includeRelations(),
        });
    }
    async getById(appId) {
        const app = await this.prisma.app.findUnique({
            where: {
                id: appId,
            },
            include: this.includeRelations(),
        });
        return app;
    }
    async get(appName, ownerAddress) {
        const app = await this.prisma.app.findUnique({
            where: {
                name_ownerAddress: {
                    name: appName,
                    ownerAddress: ownerAddress,
                },
            },
            include: this.includeRelations(),
        });
        return app;
    }
    async create({ name, description, metadata, ownerAddress }) {
        const app = await this.prisma.app.create({
            data: {
                name: name,
                description: description,
                metadata: metadata,
                ownerAddress: ownerAddress,
            },
            include: this.includeRelations(),
        });
        return app;
    }
    async update(appName, ownerAddress, { description, metadata, name }) {
        const app = await this.prisma.app.upsert({
            where: {
                name_ownerAddress: {
                    name: appName,
                    ownerAddress: ownerAddress,
                },
            },
            update: {
                name: name,
                description: description,
                metadata: metadata,
            },
            create: {
                name: name,
                description: description,
                metadata: metadata,
                ownerAddress: ownerAddress,
            },
            include: this.includeRelations(),
        });
        return app;
    }
    async delete(appName, ownerAddress) {
        await this.prisma.app.deleteMany({
            where: {
                ownerAddress: ownerAddress,
                name: appName,
            },
        });
    }
    includeRelations(Event = true, Provider = true, User = true) {
        return {
            Event: Event,
            Provider: Provider,
            User: User,
        };
    }
}
exports.AppDB = AppDB;
