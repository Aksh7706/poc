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
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../db/db");
const helper_1 = require("../helper");
const router = express_1.default.Router();
const getNotification = joi_1.default.object({
    apiKey: joi_1.default.string().required(),
    appName: joi_1.default.string().required(),
    userWalletAddress: joi_1.default.string().required(),
});
const getInAppNotifications = ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = (0, helper_1.validatePayload)(Object.assign({}, body), getNotification);
        if (payload === undefined)
            return;
        const account = yield (0, helper_1.accountExists)(payload.apiKey);
        const app = yield (0, helper_1.appExists)(payload.appName, account.ownerAddress);
        const notifications = yield db_1.db.inAppNotification.getAll(app.id, payload.userWalletAddress);
        res.status(200).send(notifications);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
router.post('/dapp/in-app', getInAppNotifications);
exports.default = router;
