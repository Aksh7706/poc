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
const helper_1 = require("../helper");
const authValidation_1 = require("../middleware/authValidation");
const router = express_1.default.Router();
const getAllUsers = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = yield (0, helper_1.appExists)(body.appName, ownerAddress);
        const user = yield db_1.db.user.getAll(app.id);
        return res.status(200).send(user);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
const getUser = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.appName || !body.walletAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = yield (0, helper_1.appExists)(body.appName, ownerAddress);
        const user = yield db_1.db.user.get(app.id, body.walletAddress);
        return res.status(200).send(user);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
const upsertUser = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.appName || !body.walletAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD' });
    try {
        const app = yield (0, helper_1.appExists)(body.appName, ownerAddress);
        const user = yield db_1.db.user.update(app.id, body.walletAddress, {
            email: body.email,
            mobile: body.mobile
        });
        return res.status(200).send(user);
    }
    catch (err) {
        return (0, helper_1.handleError)(err, res);
    }
});
router.post('/get', authValidation_1.omniAuthValidation, getUser);
router.post('/getAll', authValidation_1.omniAuthValidation, getAllUsers);
router.post('/upsert', authValidation_1.omniAuthValidation, upsertUser);
exports.default = router;
