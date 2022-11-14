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
const getAllApps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const app = yield db_1.db.app.getAll(req.ownerAddress);
    return res.status(200).send(app);
});
const createApp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });
    const app = yield db_1.db.app.create({
        name: req.body.appName,
        description: req.body.description,
        ownerAddress: req.ownerAddress,
    });
    return res.status(200).send(app);
});
const getApp = ({ body, ownerAddress }, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });
    const app = yield db_1.db.app.get(body.appName, ownerAddress);
    return res.status(200).send(app);
});
const deleteApp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.appName)
        return res.status(400).json({ reason: 'INVALID_PAYLOAD', explanation: 'name can not be undefined' });
    yield db_1.db.app.delete(req.body.appName, req.ownerAddress);
    return res.status(200).send('App Deleted Successfully');
});
router.get('/getAll', authValidation_1.authValidation, getAllApps);
router.post('/get', authValidation_1.authValidation, getApp);
router.post('/create', authValidation_1.authValidation, createApp);
router.post('/delete', authValidation_1.authValidation, deleteApp);
exports.default = router;
