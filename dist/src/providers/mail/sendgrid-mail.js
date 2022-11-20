"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridMail = void 0;
const types_1 = require("../../types");
const mail_1 = __importDefault(require("@sendgrid/mail"));
class SendGridMail {
    async setupProvider({ config }) {
        if (!config.fromAddress || !config.fromName || !config.apiKey || !config.replyToAddress) {
            throw new types_1.ErrorInvalidArg('Invalid config provided.');
        }
    }
    async sendMessage({ provider, user, data }) {
        let fromAddress, fromName, apiKey, replyToAddress;
        if (provider.config) {
            const config = provider.config;
            fromAddress = config.fromAddress;
            fromName = config.fromName;
            apiKey = config.apiKey;
            replyToAddress = config.replyToAddress;
        }
        if (!fromAddress || !fromName || !apiKey || !replyToAddress || !user.email)
            return;
        mail_1.default.setApiKey(apiKey);
        // Sample message
        // const msg = {
        //   to: 'test@example.com',
        //   from: 'test@example.com', // Use the email address or domain you verified above
        //   subject: 'Sending with Twilio SendGrid is Fun',
        //   text: 'and easy to do anywhere, even with Node.js',
        //   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        // };
        await mail_1.default.send({
            to: user.email,
            replyTo: replyToAddress,
            from: {
                email: fromAddress,
                name: fromName
            },
            subject: data.subject,
            html: data.message,
        });
    }
}
exports.SendGridMail = SendGridMail;
