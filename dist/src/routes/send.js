"use strict";
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
    apiKey: joi_1.default.string().optional(),
    txHash: joi_1.default.string().optional(),
    data: joi_1.default.object().optional(),
});
const sendEventHelper = async ({ appName, eventName, userWalletAddress, data, ownerAddress }) => {
    const providerAPI = new provider_1.Provider(db_1.prismaClient);
    const app = await (0, helper_1.appExists)(appName, ownerAddress);
    const user = await (0, helper_1.userExists)(app.id, userWalletAddress);
    const event = await (0, helper_1.eventExists)(app.id, eventName);
    const template = event.template;
    let failedNotifications = 0;
    await Promise.all(event.connectedProviders.map(async (eventProvider) => {
        const provider = await db_1.db.provider.get(app.id, eventProvider.providerName);
        if (!provider)
            return;
        const providerTemplate = template[provider.channel];
        const parsedMsg = handlebars_1.default.compile(providerTemplate?.message ?? '');
        const message = parsedMsg(data);
        const parsedSubject = handlebars_1.default.compile(providerTemplate?.subject ?? '');
        const subject = parsedSubject(data);
        const parsedData = {
            message: message,
            subject: subject,
        };
        try {
            await providerAPI.send({
                app: app,
                event: event,
                provider: provider,
                user: user,
                data: parsedData,
            });
            await (0, helper_1.logEvent)({ app: app, event: event, data: parsedData, provider: provider, user: user }, 'DELIVERED');
        }
        catch (e) {
            failedNotifications += 1;
            await (0, helper_1.logEvent)({ app: app, event: event, data: parsedData, provider: provider, user: user }, 'FAILED');
        }
    }));
    if (failedNotifications !== 0)
        throw new types_1.ErrorGeneric({ reason: 'FAILURE', explanation: `${failedNotifications} notifications failed to send.` });
};
exports.sendEventHelper = sendEventHelper;
const sendEventFromParser = async (args) => {
    try {
        let account;
        if (args?.apiKey) {
            account = await (0, helper_1.accountExists)(args.apiKey);
        }
        if (!account && args?.contractAddress) {
            account = await db_1.db.account.getByContractAddress(args.contractAddress);
        }
        if (!account)
            return; // Account does not exist
        const payload = (0, helper_1.validatePayload)({
            appName: args?.appName,
            eventName: args?.eventName,
            userWalletAddress: args?.userWalletAddress,
            data: args?.data,
            ownerAddress: account.ownerAddress,
        }, sendSchema);
        if (payload === undefined)
            return;
        await (0, exports.sendEventHelper)(payload);
    }
    catch (err) {
        if (err instanceof Error) {
            console.log("Erorr : ", err?.message);
        }
    }
};
exports.sendEventFromParser = sendEventFromParser;
const sendEvent = async ({ body, ownerAddress }, res) => {
    try {
        const payload = (0, helper_1.validatePayload)({ ownerAddress: ownerAddress, ...body }, sendSchema);
        if (payload === undefined)
            return;
        await (0, exports.sendEventHelper)(payload);
        res.sendStatus(200);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
};
router.post('/', authValidation_1.omniAuthValidation, sendEvent);
exports.default = router;
