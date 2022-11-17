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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEvent = exports.handleError = exports.validatePayload = exports.checkUniqueEvent = exports.checkUniqueProvider = exports.userExists = exports.eventExists = exports.providerExists = exports.checkUniqueApp = exports.appExists = exports.accountExists = void 0;
const db_1 = require("./db/db");
const types_1 = require("./types");
const axios_1 = require("axios");
const accountExists = (apiKey) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield db_1.db.account.getByApiKey(apiKey);
    if (!account)
        throw new types_1.ErrorInvalidArg('Invalid api key');
    return account;
});
exports.accountExists = accountExists;
const appExists = (appName, ownerAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const app = yield db_1.db.app.get(appName, ownerAddress);
    if (!app)
        throw new types_1.ErrorInvalidArg('App does not exist');
    return app;
});
exports.appExists = appExists;
const checkUniqueApp = (appName, ownerAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const app = yield db_1.db.app.get(appName, ownerAddress);
    if (app)
        throw new types_1.ErrorInvalidArg('App with this name already exist');
});
exports.checkUniqueApp = checkUniqueApp;
const providerExists = (appId, providerName) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = yield db_1.db.provider.get(appId, providerName);
    if (!provider)
        throw new types_1.ErrorInvalidArg('Provider does not exist');
    return provider;
});
exports.providerExists = providerExists;
const eventExists = (appId, eventName) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield db_1.db.event.get(appId, eventName);
    if (!event)
        throw new types_1.ErrorInvalidArg('Event does not exist');
    return event;
});
exports.eventExists = eventExists;
const userExists = (appId, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.user.get(appId, walletAddress);
    if (!user)
        throw new types_1.ErrorInvalidArg('No such user exist in this app');
    return user;
});
exports.userExists = userExists;
const checkUniqueProvider = (appId, providerName) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = yield db_1.db.provider.get(appId, providerName);
    if (provider !== null) {
        throw new types_1.ErrorInvalidArg('Provider name not unique');
    }
});
exports.checkUniqueProvider = checkUniqueProvider;
const checkUniqueEvent = (appId, eventName) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield db_1.db.event.get(appId, eventName);
    if (event !== null) {
        throw new types_1.ErrorInvalidArg('Event name not unique');
    }
});
exports.checkUniqueEvent = checkUniqueEvent;
function validatePayload(data, schema) {
    const { value, error, warning } = schema.validate(data);
    if (error === undefined && warning === undefined)
        return value;
    throw new types_1.ErrorGeneric({ reason: 'INVALID_PAYLOAD', explanation: error !== null && error !== void 0 ? error : warning });
}
exports.validatePayload = validatePayload;
const handleError = (err, res) => {
    var _a;
    if (err instanceof axios_1.AxiosError) {
        const data = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data;
        const formattedErr = new types_1.ErrorAPIQuery(data === null || data === void 0 ? void 0 : data.description);
        res.status(400).send(formattedErr.message);
    }
    else if (err instanceof Error) {
        res.status(400).send(err.message);
    }
    else {
        console.log('Error : ', err);
        res.status(400).send(types_1.errorType.ErrorGeneric);
    }
};
exports.handleError = handleError;
const logEvent = ({ app, event, data, provider, user }, status) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.db.log.create({
        appName: app.name,
        eventName: event.name,
        providerName: provider.name,
        ownerAddress: app.ownerAddress,
        channel: provider.channel,
        providerType: provider.providerKey,
        userWalletAdress: user.walletAddress,
        message: JSON.stringify(data),
        status: status,
    });
});
exports.logEvent = logEvent;
