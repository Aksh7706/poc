"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const account_1 = __importDefault(require("./routes/account"));
const app_1 = __importDefault(require("./routes/app"));
const provider_1 = __importDefault(require("./routes/provider"));
const event_1 = __importDefault(require("./routes/event"));
const webhook_1 = __importDefault(require("./routes/webhook"));
const auth_1 = __importDefault(require("./routes/auth"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const user_1 = __importDefault(require("./routes/user"));
const send_1 = __importStar(require("./routes/send"));
const rabbitmq_1 = require("./rabbitmq");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 3000;
function setUpParsing(app) {
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    app.use(express_1.default.text({ type: 'text/html' }));
}
function setUpSecurityHeaders(app) {
    app.use((_, res, next) => {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'none'");
        next();
    });
}
var corsOptions = {
    credentials: true,
    origin: true
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.get('/images/:imageName', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../src', 'static', 'provider', req.params.imageName));
});
setUpSecurityHeaders(app);
setUpParsing(app);
app.use('/account', account_1.default);
app.use('/auth', auth_1.default);
app.use('/providers', provider_1.default);
app.use('/events', event_1.default);
app.use('/apps', app_1.default, send_1.default);
app.use('/send', send_1.default);
app.use('/notifications', notifications_1.default);
app.use('/users', user_1.default);
app.use(webhook_1.default);
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Near notification platform is running on port ${port}.`);
    const rabbitMqConnection = new rabbitmq_1.RabbitMqConnection();
    yield rabbitMqConnection.setUp();
    yield rabbitMqConnection.channel.consume('nnp-msg-queue', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        if (msg === null || msg === void 0 ? void 0 : msg.content) {
            const sendParams = JSON.parse(msg === null || msg === void 0 ? void 0 : msg.content.toString());
            yield (0, send_1.sendEventFromApiKey)(sendParams);
        }
        rabbitMqConnection.channel.ack(msg);
    }));
}));
