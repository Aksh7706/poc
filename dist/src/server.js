"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./routes/app"));
const provider_1 = __importDefault(require("./routes/provider"));
const event_1 = __importDefault(require("./routes/event"));
const app = (0, express_1.default)();
const port = 3000;
function setUpParsing(app) {
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(express_1.default.json());
    //app.use(express.text({ type: 'text/html' }));
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
app.use((0, cors_1.default)());
setUpSecurityHeaders(app);
setUpParsing(app);
app.use('/apps', app_1.default, provider_1.default, event_1.default);
app.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}.`);
    console.log(process.env.DATABASE_URL);
});
