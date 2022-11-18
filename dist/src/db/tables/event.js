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
exports.EventDB = void 0;
class EventDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getAll(appId, channel, providerType) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.event.findMany({
                where: {
                    appId: appId,
                },
                include: {
                    connectedProviders: true,
                },
            });
        });
    }
    get(appId, eventName) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.prisma.event.findUnique({
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
        });
    }
    create(appId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.prisma.event.create({
                data: Object.assign({ appId: appId }, args),
                include: {
                    connectedProviders: true,
                },
            });
            return event;
        });
    }
    update(appId, eventName, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.prisma.event.upsert({
                where: {
                    name_appId: {
                        appId: appId,
                        name: eventName
                    }
                },
                update: Object.assign({}, args),
                create: Object.assign({ appId: appId, name: eventName }, args),
                include: {
                    connectedProviders: true,
                },
            });
            return event;
        });
    }
    delete(appId, eventName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.event.deleteMany({
                where: {
                    name: eventName,
                    appId: appId,
                },
            });
        });
    }
    connectProvider(appId, eventName, providerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectedProvider = yield this.prisma.eventProviders.create({
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
        });
    }
    disconnectAllProvider(appId, eventName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.eventProviders.deleteMany({
                where: {
                    appId: appId,
                    eventName: eventName,
                },
            });
        });
    }
    disconnectProvider(appId, eventName, providerName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.eventProviders.deleteMany({
                where: {
                    appId: appId,
                    eventName: eventName,
                    providerName: providerName,
                },
            });
        });
    }
    getConnectedProviders(appId, eventName) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectedProviders = yield this.prisma.eventProviders.findMany({
                where: {
                    appId: appId,
                    eventName: eventName,
                },
                include: {
                    provider: true,
                },
            });
            return connectedProviders;
        });
    }
}
exports.EventDB = EventDB;
