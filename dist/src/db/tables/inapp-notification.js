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
exports.InAppNotificationDB = void 0;
class InAppNotificationDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getAll(appId, userWalletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield this.prisma.inAppWebNotifications.findMany({
                where: {
                    appId: appId,
                    userWalletAdress: userWalletAddress
                },
            });
            return notifications;
        });
    }
    get(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.prisma.inAppWebNotifications.findUnique({
                where: {
                    requestId: requestId,
                },
            });
            return notification;
        });
    }
    create(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.prisma.inAppWebNotifications.create({
                data: args,
            });
            return notification;
        });
    }
    updateStatus(requestId, isRead) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.prisma.inAppWebNotifications.update({
                where: {
                    requestId: requestId,
                },
                data: {
                    isRead: isRead,
                },
            });
            return notification;
        });
    }
    delete(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.inAppWebNotifications.delete({
                where: {
                    requestId: requestId,
                },
            });
        });
    }
}
exports.InAppNotificationDB = InAppNotificationDB;
