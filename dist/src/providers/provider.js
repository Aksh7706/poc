"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
const pegion_1 = require("./inapp/pegion");
const sendgrid_mail_1 = require("./mail/sendgrid-mail");
const telegram_1 = require("./other/telegram");
class Provider {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async setupProvider(args) {
        // add cases here
        switch (args.channel) {
            case 'MAIL':
                return this.setupMailProvider(args);
            case 'IN_APP':
                return this.setupInAppProvider(args);
            case 'OTHER':
                return this.setupOtherProvider(args);
        }
    }
    async removeProvider(args) {
        // add cases here
        switch (args.channel) {
            case 'MAIL':
                return this.removeMailProvider(args);
            case 'IN_APP':
                return this.removeInAppProvider(args);
            case 'OTHER':
                return this.removeOtherProvider(args);
        }
    }
    async send(args) {
        // add cases here
        switch (args.provider.channel) {
            case 'MAIL':
                return this.sendMailEvent(args);
            case 'IN_APP':
                return this.sendInAppEvent(args);
            case 'OTHER':
                return this.sendOtherEvent(args);
        }
    }
    async setupOtherProvider({ appId, config, provider, providerName }) {
        if (provider === 'TELEGRAM') {
            const telegramProvider = new telegram_1.Telegram();
            await telegramProvider.setupProvider(appId, providerName, config.telegramBotToken);
        }
    }
    async removeOtherProvider({ appId, config, provider, providerName }) {
        if (provider === 'TELEGRAM') {
            const telegramProvider = new telegram_1.Telegram();
            await telegramProvider.removeProvider(config.telegramBotToken);
            await this.prisma.telegramProvider.deleteMany({
                where: {
                    appId: appId,
                    providerName: providerName,
                },
            });
        }
    }
    async sendOtherEvent(args) {
        if (args.provider.providerKey === 'TELEGRAM') {
            const telegramProvider = new telegram_1.Telegram();
            await telegramProvider.sendMessage(args);
        }
    }
    async setupMailProvider(args) {
        if (args.provider === 'SENDGRID_MAIL') {
            const sendgridProvider = new sendgrid_mail_1.SendGridMail();
            await sendgridProvider.setupProvider(args);
        }
    }
    removeMailProvider(_args) {
        // do noting
    }
    setupInAppProvider(_args) {
        // do nothing
    }
    removeInAppProvider(_args) {
        // do nothing
    }
    async sendMailEvent(args) {
        if (args.provider.providerKey === 'SENDGRID_MAIL') {
            const sendgridProvider = new sendgrid_mail_1.SendGridMail();
            await sendgridProvider.sendMessage(args);
        }
    }
    async sendInAppEvent(args) {
        if (args.provider.providerKey === 'PIGEON') {
            const pigeonProvider = new pegion_1.Pigeon();
            await pigeonProvider.sendMessage(args);
        }
    }
}
exports.Provider = Provider;
