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
exports.AccountDB = void 0;
const generate_api_key_1 = __importDefault(require("generate-api-key"));
class AccountDB {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.account.findMany({
                include: {
                    App: true,
                },
            });
        });
    }
    get(ownerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = yield this.prisma.account.findUnique({
                where: {
                    ownerAddress: ownerAddress,
                },
                include: {
                    App: true,
                },
            });
            return app;
        });
    }
    getByApiKey(apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = yield this.prisma.account.findUnique({
                where: {
                    apiKey: apiKey,
                },
            });
            return app;
        });
    }
    create({ ownerAddress, name }) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.prisma.account.create({
                data: {
                    ownerAddress: ownerAddress,
                    apiKey: (0, generate_api_key_1.default)({ method: 'string', length: 30 }),
                    name: name,
                },
                include: {
                    App: true,
                },
            });
            return account;
        });
    }
    update(ownerAddress, { name }) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = yield this.prisma.account.upsert({
                where: {
                    ownerAddress: ownerAddress,
                },
                update: {
                    name: name,
                },
                create: {
                    name: name,
                    apiKey: (0, generate_api_key_1.default)({ method: 'string', length: 30 }),
                    ownerAddress: ownerAddress,
                },
                include: {
                    App: true,
                },
            });
            return app;
        });
    }
    delete(ownerAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.account.deleteMany({
                where: {
                    ownerAddress: ownerAddress,
                },
            });
        });
    }
}
exports.AccountDB = AccountDB;
