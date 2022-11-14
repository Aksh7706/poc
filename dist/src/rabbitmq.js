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
exports.RabbitMqConnection = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMqConnection {
    get channel() {
        return this._channel;
    }
    setUp() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setUpConnection();
            yield this.setUpChannel();
            yield this.channel.assertQueue('nnp-msg-queue');
        });
    }
    setUpConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Connecting to RabbitMQ...');
                this.connection = yield amqplib_1.default.connect('amqps://fvghnida:hvQ8B8sshWkQcWEInczR3_qRaiv8LMV6@puffin.rmq2.cloudamqp.com/fvghnida');
            }
            catch (err) {
                console.log(`Failed to connect: ${err}`);
                throw new Error(err);
            }
            finally {
                console.log('Connected to RabbitMQ');
            }
            this.connection.on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Disconnecting due to a connection error: ${err}`);
                yield this.disconnect();
            }));
        });
    }
    setUpChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this._channel = yield this.connection.createChannel();
            }
            catch (err) {
                console.log(`Disconnecting due to channel creation failing: ${err}`);
                yield this.disconnect();
                throw new Error(err);
            }
            this.channel.on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Disconnecting due to a channel error: ${err}`);
                yield this.disconnect();
            }));
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            const isClosed = yield this.closeChannel();
            if (!isClosed)
                return false;
            return yield this.closeConnection();
        });
    }
    closeChannel() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ((_a = this._channel) === null || _a === void 0 ? void 0 : _a.close());
            }
            catch (err) {
                console.error(`Failed to close channel: ${err}`);
                return false;
            }
            this._channel = undefined;
            return true;
        });
    }
    closeConnection() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ((_a = this.connection) === null || _a === void 0 ? void 0 : _a.close());
            }
            catch (err) {
                console.log(`Failed to close connection: ${err}`);
                return false;
            }
            this.connection = undefined;
            return true;
        });
    }
}
exports.RabbitMqConnection = RabbitMqConnection;
