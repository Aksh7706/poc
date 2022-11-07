"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUniqueProvider = exports.appExists = void 0;
const db_1 = require("./db/db");
const types_1 = require("./types");
const appExists = async (appName) => {
    const app = await db_1.db.app.get(appName);
    if (!app)
        return new types_1.ErrorInvalidArg('App does not exist');
    return undefined;
};
exports.appExists = appExists;
const checkUniqueProvider = async (appName, providerName) => {
    const provider = await db_1.db.provider.get(appName, providerName);
    if (provider) {
        return new types_1.ErrorInvalidArg('Provider name not unique');
    }
    return undefined;
};
exports.checkUniqueProvider = checkUniqueProvider;
