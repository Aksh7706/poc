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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendGridMail = void 0;
const types_1 = require("../../types");
const mail_1 = __importDefault(require("@sendgrid/mail"));
class SendGridMail {
    setupProvider({ config }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config.fromAddress || !config.fromName || !config.apiKey || !config.replyToAddress) {
                throw new types_1.ErrorInvalidArg('Invalid config provided.');
            }
        });
    }
    sendMessage({ provider, user, data }) {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield mail_1.default.send({
                to: user.email,
                replyTo: replyToAddress,
                from: {
                    email: fromAddress,
                    name: fromName
                },
                subject: data.subject,
                html: data.message,
            });
        });
    }
}
exports.SendGridMail = SendGridMail;
