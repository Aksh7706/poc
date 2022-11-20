"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telegram = void 0;
const axios_1 = __importDefault(require("axios"));
const types_1 = require("../../types");
class Telegram {
    constructor() {
        this.baseURL = 'https://api.telegram.org';
        this.serverURL = process.env.SERVER_URL;
    }
    //Send Api Telegram
    //https://api.telegram.org/bot{bot_token}/sendMessage?chat_id={chat_id}&text={text}
    async sendMessage({ user, provider, data }) {
        let chatId, token;
        const chatIdData = user.telegramData.filter((data) => data.providerName === provider.name)[0];
        chatId = chatIdData?.chatId;
        if (provider.config) {
            const config = provider.config;
            token = config.telegramBotToken;
        }
        if (!token) {
            console.log('Send Event Log : Bot token not found');
            return;
        }
        if (!chatId) {
            console.log('Send Event Log : User chat id not found');
            return;
        }
        const params = {
            chat_id: chatId,
            text: data.message,
        };
        const methodEndpoint = `${this.baseURL}/bot${token}/sendMessage`;
        await axios_1.default.get(methodEndpoint, { params });
        //console.log(data);
    }
    async setupProvider(appId, providerName, token) {
        if (!token)
            throw new types_1.ErrorInvalidArg('Bot Access Token Invalid');
        await this.addWebhook(appId, providerName, token);
    }
    async removeProvider(token) {
        if (!token)
            throw new types_1.ErrorInvalidArg('Bot Access Token Invalid');
        await this.deleteWebhook(token);
    }
    async addWebhook(appId, providerName, token) {
        const params = { url: `${this.serverURL}/webhook/${appId}/${providerName}` };
        const methodEndpoint = `${this.baseURL}/bot${token}/setWebhook`;
        const { data } = await axios_1.default.get(methodEndpoint, { params });
        if (!data.ok)
            throw new types_1.ErrorInvalidArg(data.description);
    }
    async deleteWebhook(token) {
        const methodEndpoint = `${this.baseURL}/bot${token}/deleteWebhook`;
        const { data } = await axios_1.default.get(methodEndpoint);
        if (!data.ok)
            throw new types_1.ErrorInvalidArg(data.description);
    }
}
exports.Telegram = Telegram;
