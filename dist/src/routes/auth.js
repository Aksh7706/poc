"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const login = async (req, res) => {
    if (!req.body.ownerAddress)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'ownerAddress can not be undefined' });
    const ownerAddress = req.body.ownerAddress;
    let account = await db_1.db.account.get(ownerAddress);
    if (!account) {
        account = await db_1.db.account.create({
            ownerAddress: ownerAddress,
            name: '',
            contractAddress: req.body.ownerAddress,
        });
    }
    const token = jsonwebtoken_1.default.sign({ ownerAddress: ownerAddress }, 'YOUR_SECRET_KEY', { expiresIn: '365d' });
    return res.cookie('access_token', token, { sameSite: 'none', secure: true }).status(200).send(account);
};
const logout = async (req, res) => {
    return res.clearCookie('access_token').sendStatus(200);
};
router.post('/login', login);
router.get('/logout', logout);
exports.default = router;
