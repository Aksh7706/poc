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
const authValidation_1 = require("../middleware/authValidation");
const router = express_1.default.Router();
const getAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.ownerAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'Something went wrong.' });
    const account = yield db_1.db.account.get(req.ownerAddress);
    return res.status(200).send(account);
});
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.ownerAddress || !req.body.accountName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'Something went wrong.' });
    const account = yield db_1.db.account.update(req.ownerAddress, { name: req.body.accountName });
    return res.status(200).send(account);
});
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.ownerAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'Something went wrong.' });
    yield db_1.db.account.delete(req.ownerAddress);
    return res.sendStatus(200);
});
router.get('/', authValidation_1.authValidation, getAccount);
router.get('/update', authValidation_1.authValidation, updateAccount);
router.get('/delete', authValidation_1.authValidation, deleteAccount);
exports.default = router;
