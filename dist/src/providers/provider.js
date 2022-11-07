"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Provider = void 0;
const telegram_1 = require("./other/telegram");
class Provider {
    async setupProvider(args) {
        // add cases here
        switch (args.channel) {
            case 'PUSH':
                return this.setupPushProvider(args);
            case 'IN_APP':
                return this.setupInAppProvider(args);
            case 'OTHER':
                return this.setupOtherProvider(args);
        }
    }
    async setupOtherProvider({ app, config, provider }) {
        if (provider === 'TELEGRAM') {
            const telegramProvider = new telegram_1.Telegram();
            try {
                await telegramProvider.setupProvider(app, config.token);
            }
            catch (err) {
                throw err;
            }
        }
    }
    setupPushProvider(_args) {
        // do noting
    }
    setupInAppProvider(_args) {
        // do nothing
    }
}
exports.Provider = Provider;
