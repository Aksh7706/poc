"use strict";
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
    async getAll() {
        return this.prisma.account.findMany({
            include: {
                App: true,
            },
        });
    }
    async get(ownerAddress) {
        const app = await this.prisma.account.findUnique({
            where: {
                ownerAddress: ownerAddress,
            },
            include: {
                App: true,
            },
        });
        return app;
    }
    async getByApiKey(apiKey) {
        const app = await this.prisma.account.findUnique({
            where: {
                apiKey: apiKey,
            },
        });
        return app;
    }
    async getByContractAddress(contractAddress) {
        const app = await this.prisma.account.findUnique({
            where: {
                contractAddress: contractAddress,
            },
        });
        return app;
    }
    async create({ ownerAddress, name, contractAddress }) {
        const account = await this.prisma.account.create({
            data: {
                ownerAddress: ownerAddress,
                apiKey: (0, generate_api_key_1.default)({ method: 'string', length: 30 }),
                name: name,
                contractAddress: contractAddress
            },
            include: {
                App: true,
            },
        });
        return account;
    }
    async update(ownerAddress, { name, contractAddress }) {
        const app = await this.prisma.account.upsert({
            where: {
                ownerAddress: ownerAddress,
            },
            update: {
                name: name,
                contractAddress: contractAddress,
            },
            create: {
                contractAddress: ownerAddress,
                name: name,
                apiKey: (0, generate_api_key_1.default)({ method: 'string', length: 30 }),
                ownerAddress: ownerAddress,
            },
            include: {
                App: true,
            },
        });
        return app;
    }
    async delete(ownerAddress) {
        await this.prisma.account.deleteMany({
            where: {
                ownerAddress: ownerAddress,
            },
        });
    }
}
exports.AccountDB = AccountDB;
