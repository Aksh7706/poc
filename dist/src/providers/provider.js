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
exports.Provider = void 0;
const pegion_1 = require("./inapp/pegion");
const sendgrid_mail_1 = require("./mail/sendgrid-mail");
const telegram_1 = require("./other/telegram");
class Provider {
    constructor(prisma) {
        this.prisma = prisma;
    }
    setupProvider(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // add cases here
            switch (args.channel) {
                case 'MAIL':
                    return this.setupMailProvider(args);
                case 'IN_APP':
                    return this.setupInAppProvider(args);
                case 'OTHER':
                    return this.setupOtherProvider(args);
            }
        });
    }
    removeProvider(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // add cases here
            switch (args.channel) {
                case 'MAIL':
                    return this.removeMailProvider(args);
                case 'IN_APP':
                    return this.removeInAppProvider(args);
                case 'OTHER':
                    return this.removeOtherProvider(args);
            }
        });
    }
    send(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // add cases here
            switch (args.provider.channel) {
                case 'MAIL':
                    return this.sendMailEvent(args);
                case 'IN_APP':
                    return this.sendInAppEvent(args);
                case 'OTHER':
                    return this.sendOtherEvent(args);
            }
        });
    }
    setupOtherProvider({ appId, config, provider, providerName }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (provider === 'TELEGRAM') {
                const telegramProvider = new telegram_1.Telegram();
                yield telegramProvider.setupProvider(appId, providerName, config.telegramBotToken);
            }
        });
    }
    removeOtherProvider({ appId, config, provider, providerName }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (provider === 'TELEGRAM') {
                const telegramProvider = new telegram_1.Telegram();
                yield telegramProvider.removeProvider(config.telegramBotToken);
                yield this.prisma.telegramProvider.deleteMany({
                    where: {
                        appId: appId,
                        providerName: providerName,
                    },
                });
            }
        });
    }
    sendOtherEvent(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.provider.providerKey === 'TELEGRAM') {
                const telegramProvider = new telegram_1.Telegram();
                yield telegramProvider.sendMessage(args);
            }
        });
    }
    setupMailProvider(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.provider === 'SENDGRID_MAIL') {
                const sendgridProvider = new sendgrid_mail_1.SendGridMail();
                yield sendgridProvider.setupProvider(args);
            }
        });
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
    sendMailEvent(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.provider.providerKey === 'SENDGRID_MAIL') {
                const sendgridProvider = new sendgrid_mail_1.SendGridMail();
                yield sendgridProvider.sendMessage(args);
            }
        });
    }
    sendInAppEvent(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.provider.providerKey === 'PIGEON') {
                const pigeonProvider = new pegion_1.Pigeon();
                yield pigeonProvider.sendMessage(args);
            }
        });
    }
}
exports.Provider = Provider;
