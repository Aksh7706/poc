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
exports.UserDB = void 0;
class UserDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getAll(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.user.findMany({
                where: {
                    appId: appId,
                },
                include: {
                    telegramData: true,
                },
            });
        });
    }
    get(appId, walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findUnique({
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
        });
    }
    create(appId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.create({
                data: Object.assign({ appId: appId }, args),
                include: {
                    telegramData: true,
                },
            });
            return user;
        });
    }
    update(appId, walletAddress, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.upsert({
                where: {
                    walletAddress_appId: {
                        appId: appId,
                        walletAddress: walletAddress,
                    },
                },
                update: Object.assign({}, args),
                create: Object.assign({ appId: appId, walletAddress: walletAddress }, args),
                include: {
                    telegramData: true,
                },
            });
            return user;
        });
    }
    delete(appId, walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.user.deleteMany({
                where: {
                    appId: appId,
                    walletAddress: walletAddress,
                },
            });
        });
    }
    addTelegramChatId(appId, walletAddress, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataProcessed = data.map((t) => {
                return {
                    appId: appId,
                    walletAddress: walletAddress,
                    providerName: t.providerName,
                    chatId: t.chatId,
                };
            });
            yield this.prisma.telegramProvider.createMany({
                data: dataProcessed,
                skipDuplicates: true,
            });
            return this.get(appId, walletAddress);
        });
    }
    updateTelegramChatId(appId, walletAddress, providerName, chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.telegramProvider.upsert({
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
        });
    }
    deleteTelegramChatId(appId, walletAddress, providerName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.telegramProvider.deleteMany({
                where: {
                    appId: appId,
                    walletAddress: walletAddress,
                    providerName: providerName,
                },
            });
            return this.get(appId, walletAddress);
        });
    }
}
exports.UserDB = UserDB;
