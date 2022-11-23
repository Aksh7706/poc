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
exports.RedisHelper = void 0;
const redis = __importStar(require("redis"));
const crypto_1 = __importDefault(require("crypto"));
class RedisHelper {
    static getRedis() {
        if (this.client === null || !this.client)
            //create new one
            this.client = redis.createClient({ url: process.env.REDIS_URL });
        return this.client;
    }
    static async setup() {
        const client = this.getRedis();
        console.log('Connecting to Redis...');
        await client.connect();
        console.log('Connected to Redis...');
    }
    static async createOTP(walletAddress) {
        var id = crypto_1.default.randomBytes(10).toString('hex');
        await this.client.setEx(id, 180, walletAddress);
        return id;
    }
    static async getWalletFromOTP(otp) {
        return this.client.get(otp);
    }
}
exports.RedisHelper = RedisHelper;
