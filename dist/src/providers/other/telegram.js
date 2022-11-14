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
    sendMessage({ user, provider, data }) {
        return __awaiter(this, void 0, void 0, function* () {
            let chatId, token;
            const chatIdData = user.telegramData.filter((data) => data.providerName === provider.name)[0];
            chatId = chatIdData === null || chatIdData === void 0 ? void 0 : chatIdData.chatId;
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
            yield axios_1.default.get(methodEndpoint, { params });
            //console.log(data);
        });
    }
    setupProvider(appId, providerName, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token)
                throw new types_1.ErrorInvalidArg('Bot Access Token Invalid');
            yield this.addWebhook(appId, providerName, token);
        });
    }
    removeProvider(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token)
                throw new types_1.ErrorInvalidArg('Bot Access Token Invalid');
            yield this.deleteWebhook(token);
        });
    }
    addWebhook(appId, providerName, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = { url: `${this.serverURL}/webhook/${appId}/${providerName}` };
            const methodEndpoint = `${this.baseURL}/bot${token}/setWebhook`;
            const { data } = yield axios_1.default.get(methodEndpoint, { params });
            if (!data.ok)
                throw new types_1.ErrorInvalidArg(data.description);
        });
    }
    deleteWebhook(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const methodEndpoint = `${this.baseURL}/bot${token}/deleteWebhook`;
            const { data } = yield axios_1.default.get(methodEndpoint);
            if (!data.ok)
                throw new types_1.ErrorInvalidArg(data.description);
        });
    }
}
exports.Telegram = Telegram;
