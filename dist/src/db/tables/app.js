"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDB = void 0;
class AppDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll() {
        return this.prisma.app.findMany({
            include: this.includeRelations(),
        });
    }
    async get(appName) {
        const app = await this.prisma.app.findUnique({
            where: {
                name: appName,
            },
            include: this.includeRelations(),
        });
        return app;
    }
    async create({ name, description, metadata }) {
        const app = await this.prisma.app.create({
            data: {
                name: name,
                description: description,
                metadata: metadata,
            },
            include: this.includeRelations(),
        });
        return app;
    }
    async update(appName, { description, metadata }) {
        const app = await this.prisma.app.upsert({
            where: {
                name: appName,
            },
            update: {
                description: description,
                metadata: metadata,
            },
            create: {
                name: appName,
                description: description,
                metadata: metadata,
            },
            include: this.includeRelations(),
        });
        return app;
    }
    async delete(appName) {
        await this.prisma.app.deleteMany({
            where: {
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
