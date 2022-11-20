"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniAuthValidation = exports.authValidation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helper_1 = require("../helper");
const authValidation = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.sendStatus(403);
    }
    try {
        const data = jsonwebtoken_1.default.verify(token, 'YOUR_SECRET_KEY');
        if (!data?.ownerAddress)
            return res.clearCookie('access_token').sendStatus(403);
        req.ownerAddress = data.ownerAddress;
        return next();
    }
    catch {
        return res.clearCookie('access_token').sendStatus(403);
    }
};
exports.authValidation = authValidation;
const omniAuthValidation = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (token)
            return (0, exports.authValidation)(req, res, next);
        if (!req.body.apiKey)
            return res.sendStatus(403);
        const account = await (0, helper_1.accountExists)(req.body.apiKey);
        req.ownerAddress = account.ownerAddress;
        return next();
    }
    catch {
        return res.sendStatus(403);
    }
};
exports.omniAuthValidation = omniAuthValidation;
