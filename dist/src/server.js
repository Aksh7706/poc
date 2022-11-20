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
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        next();
    });
}
var corsOptions = {
    credentials: true,
    origin: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
// app.get('/images/:imageName', (req, res) => {
//   res.sendFile(path.join(__dirname,'../../src', 'static', 'provider', req.params.imageName))
// });
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../../src', 'static', 'provider')));
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
app.listen(port, async () => {
    console.log(`Near notification platform is running on port ${port}.`);
    const rabbitMqConnection = new rabbitmq_1.RabbitMqConnection();
    await rabbitMqConnection.setUp();
    //let i =0;
    await rabbitMqConnection.channel.consume('nnp-msg-queue', (msg) => {
        if (msg?.content) {
            //console.log("Count", i++)
            const sendParams = JSON.parse(msg?.content.toString());
            (0, send_1.sendEventFromParser)(sendParams).then(e => {
                rabbitMqConnection.channel.ack(msg);
                //console.log("Count Ack")
            }).catch(e => { });
        }
    });
});
