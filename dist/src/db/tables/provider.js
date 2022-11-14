"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderDB = void 0;
class ProviderDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getAll(appId, channel, providerType) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    get(appId, providerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.prisma.provider.findUnique({
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
        });
    }
    create(appId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.prisma.provider.create({
                data: Object.assign({ appId: appId }, args),
                include: {
                    EventProviders: true,
                },
            });
            return provider;
        });
    }
    update(appId, providerName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = yield this.prisma.provider.upsert({
                where: {
                    name_appId: {
                        name: providerName,
                        appId: appId,
                    },
                },
                update: Object.assign({}, args),
                create: Object.assign({ name: providerName, appId: appId }, args),
                include: {
                    EventProviders: true,
                },
            });
            return provider;
        });
    }
    delete(appId, providerName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.provider.deleteMany({
                where: {
                    name: providerName,
                    appId: appId,
                },
            });
        });
    }
    getConnectedEvents(appId, providerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const events = yield this.prisma.eventProviders.findMany({
                where: {
                    appId: appId,
                    providerName: providerName,
                },
                include: {
                    Event: true,
                },
            });
            return events;
        });
    }
}
exports.ProviderDB = ProviderDB;
