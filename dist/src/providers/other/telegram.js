"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telegram = void 0;
const axios_1 = __importStar(require("axios"));
const types_1 = require("../../types");
class Telegram {
    constructor() {
        this.baseURL = 'https://api.telegram.org';
        this.serverURL = process.env.SERVER_URL;
        this.handleError = (err) => {
            if (err instanceof axios_1.AxiosError) {
                const data = err.response?.data;
                return Error(data);
            }
            if (err instanceof Error)
                return err;
            return new types_1.ErrorGeneric(types_1.errorType.ErrorGeneric);
        };
    }
    async setupProvider(app, token) {
        if (!token)
            throw new types_1.ErrorInvalidArg('Bot Access Token Invalid');
        try {
            await this.addWebhook(app, token);
        }
        catch (err) {
            throw err;
        }
    }
    async addWebhook(app, token) {
        const params = { url: `${this.serverURL}/webhook/${app}` };
        const methodEndpoint = `${this.baseURL}/bot${token}/setWebhook`;
        try {
            const { data } = await axios_1.default.get(methodEndpoint, { params });
            if (!data.ok)
                throw new types_1.ErrorInvalidArg(data.description);
        }
        catch (err) {
            throw this.handleError(err);
        }
    }
    async deleteWebhook(token) {
        const methodEndpoint = `${this.baseURL}/bot${token}/deleteWebhook`;
        try {
            const { data } = await axios_1.default.get(methodEndpoint);
            if (!data.ok)
                throw new types_1.ErrorInvalidArg(data.description);
        }
        catch (err) {
            throw this.handleError(err);
        }
    }
}
exports.Telegram = Telegram;
