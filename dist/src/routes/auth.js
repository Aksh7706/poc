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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.ownerAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'ownerAddress can not be undefined' });
    const ownerAddress = req.body.ownerAddress;
    let account = yield db_1.db.account.get(ownerAddress);
    if (!account) {
        account = yield db_1.db.account.create({
            ownerAddress: ownerAddress,
            name: '',
        });
    }
    const token = jsonwebtoken_1.default.sign({ ownerAddress: ownerAddress }, 'YOUR_SECRET_KEY', { expiresIn: '365d' });
    return res
        .cookie('access_token', token, {
        domain: 'localhost',
    })
        .status(200)
        .send(account);
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.clearCookie('access_token').sendStatus(200);
});
router.post('/login', login);
router.get('/logout', logout);
exports.default = router;
