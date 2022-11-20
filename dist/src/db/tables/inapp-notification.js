"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InAppNotificationDB = void 0;
class InAppNotificationDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(appId, userWalletAddress) {
        const notifications = await this.prisma.inAppWebNotifications.findMany({
            where: {
                appId: appId,
                userWalletAdress: userWalletAddress
            },
        });
        return notifications;
    }
    async get(requestId) {
        const notification = await this.prisma.inAppWebNotifications.findUnique({
            where: {
                requestId: requestId,
            },
        });
        return notification;
    }
    async create(args) {
        const notification = await this.prisma.inAppWebNotifications.create({
            data: args,
        });
        return notification;
    }
    async updateStatus(requestId, isRead) {
        const notification = await this.prisma.inAppWebNotifications.update({
            where: {
                requestId: requestId,
            },
            data: {
                isRead: isRead,
            },
        });
        return notification;
    }
    async delete(requestId) {
        await this.prisma.inAppWebNotifications.delete({
            where: {
                requestId: requestId,
            },
        });
    }
}
exports.InAppNotificationDB = InAppNotificationDB;
