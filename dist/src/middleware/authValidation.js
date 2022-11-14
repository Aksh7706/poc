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
        if (!(data === null || data === void 0 ? void 0 : data.ownerAddress))
            return res.clearCookie('access_token').sendStatus(403);
        req.ownerAddress = data.ownerAddress;
        return next();
    }
    catch (_a) {
        return res.clearCookie('access_token').sendStatus(403);
    }
};
exports.authValidation = authValidation;
const omniAuthValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.access_token;
        if (token)
            return (0, exports.authValidation)(req, res, next);
        if (!req.body.apiKey)
            return res.sendStatus(403);
        const account = yield (0, helper_1.accountExists)(req.body.apiKey);
        req.ownerAddress = account.ownerAddress;
        return next();
    }
    catch (_a) {
        return res.sendStatus(403);
    }
});
exports.omniAuthValidation = omniAuthValidation;
