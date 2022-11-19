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
exports.sendEventFromParser = exports.sendEventHelper = void 0;
const express_1 = __importDefault(require("express"));
const handlebars_1 = __importDefault(require("handlebars"));
const joi_1 = __importDefault(require("joi"));
const db_1 = require("../db/db");
const helper_1 = require("../helper");
const authValidation_1 = require("../middleware/authValidation");
const provider_1 = require("../providers/provider");
const types_1 = require("../types");
const router = express_1.default.Router();
const sendSchema = joi_1.default.object({
    appName: joi_1.default.string().required(),
    eventName: joi_1.default.string().required(),
    ownerAddress: joi_1.default.string().required(),
    userWalletAddress: joi_1.default.string().required(),
    txHash: joi_1.default.string().optional(),
    data: joi_1.default.object().optional(),
});
const sendEventHelper = ({ appName, eventName, userWalletAddress, data, ownerAddress }) => __awaiter(void 0, void 0, void 0, function* () {
    const providerAPI = new provider_1.Provider(db_1.prismaClient);
    const app = yield (0, helper_1.appExists)(appName, ownerAddress);
    const user = yield (0, helper_1.userExists)(app.id, userWalletAddress);
    const event = yield (0, helper_1.eventExists)(app.id, eventName);
    const template = event.template;
    let failedNotifications = 0;
    yield Promise.all(event.connectedProviders.map((eventProvider) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const provider = yield db_1.db.provider.get(app.id, eventProvider.providerName);
        if (!provider)
            return;
        const providerTemplate = template[provider.channel];
        const parsedMsg = handlebars_1.default.compile((_a = providerTemplate === null || providerTemplate === void 0 ? void 0 : providerTemplate.message) !== null && _a !== void 0 ? _a : '');
        const message = parsedMsg(data);
        const parsedSubject = handlebars_1.default.compile((_b = providerTemplate === null || providerTemplate === void 0 ? void 0 : providerTemplate.subject) !== null && _b !== void 0 ? _b : '');
        const subject = parsedSubject(data);
        const parsedData = {
            message: message,
            subject: subject,
        };
        try {
            yield providerAPI.send({
                app: app,
                event: event,
                provider: provider,
                user: user,
                data: parsedData,
            });
            yield (0, helper_1.logEvent)({ app: app, event: event, data: parsedData, provider: provider, user: user }, 'DELIVERED');
        }
        catch (e) {
            failedNotifications += 1;
            yield (0, helper_1.logEvent)({ app: app, event: event, data: parsedData, provider: provider, user: user }, 'FAILED');
        }
    })));
    if (failedNotifications !== 0)
        throw new types_1.ErrorGeneric({ reason: 'FAILURE', explanation: `${failedNotifications} notifications failed to send.` });
});
exports.sendEventHelper = sendEventHelper;
const sendEventFromParser = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let account;
        if (args === null || args === void 0 ? void 0 : args.apiKey) {
            account = yield (0, helper_1.accountExists)(args.apiKey);
        }
        if (!account && (args === null || args === void 0 ? void 0 : args.contractAddress)) {
            account = yield db_1.db.account.getByContractAddress(args.contractAddress);
        }
        if (!account)
            return; // Account does not exist
        const payload = (0, helper_1.validatePayload)({
            appName: args === null || args === void 0 ? void 0 : args.appName,
            eventName: args === null || args === void 0 ? void 0 : args.eventName,
            userWalletAddress: args === null || args === void 0 ? void 0 : args.userWalletAddress,
            data: args === null || args === void 0 ? void 0 : args.data,
            ownerAddress: account.ownerAddress,
        }, sendSchema);
        if (payload === undefined)
            return;
        yield (0, exports.sendEventHelper)(payload);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log("Erorr : ", err === null || err === void 0 ? void 0 : err.message);
        }
    }
});
exports.sendEventFromParser = sendEventFromParser;
const sendEvent = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = (0, helper_1.validatePayload)(Object.assign({ ownerAddress: ownerAddress }, body), sendSchema);
        if (payload === undefined)
            return;
        yield (0, exports.sendEventHelper)(payload);
        res.sendStatus(200);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
router.post('/', authValidation_1.omniAuthValidation, sendEvent);
exports.default = router;
