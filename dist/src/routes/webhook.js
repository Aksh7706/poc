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
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const router = express_1.default.Router();
router.post('/webhook/:appId/:providerName', ({ params, body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const appId = params.appId;
    const providerName = params.providerName;
    if (!appId || !providerName)
        return res.sendStatus(200);
    const app = yield db_1.db.app.getById(appId);
    const provider = yield db_1.db.provider.get(appId, providerName);
    if (!app || !provider)
        return res.sendStatus(200); // if app or provider does not exist
    if (provider.providerKey !== 'TELEGRAM')
        return res.sendStatus(200); // TODO: Make hook more generalized
    const message = (_b = (_a = body === null || body === void 0 ? void 0 : body.message) === null || _a === void 0 ? void 0 : _a.text) !== null && _b !== void 0 ? _b : '';
    const msgArray = message.split(' ');
    const chatId = (_d = (_c = body === null || body === void 0 ? void 0 : body.message) === null || _c === void 0 ? void 0 : _c.chat) === null || _d === void 0 ? void 0 : _d.id;
    if (msgArray.length === 2 && msgArray[0] === '/start' && chatId) {
        const walletAddress = msgArray[1]; // TODO: add method to validate isWalletAddress
        if (!walletAddress)
            return res.sendStatus(200);
        let user = yield db_1.db.user.get(appId, walletAddress);
        if (!user) {
            user = yield db_1.db.user.create(appId, {
                walletAddress: walletAddress,
                telegramData: {
                    create: {
                        chatId: chatId.toString(),
                        providerName: providerName,
                    }
                }
            });
        }
        else {
            user = yield db_1.db.user.updateTelegramChatId(appId, walletAddress, providerName, chatId.toString());
        }
        console.log("User : ", user);
    }
    return res.sendStatus(200);
}));
exports.default = router;
