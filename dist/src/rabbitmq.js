"use strict";
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
    async setUp() {
        await this.setUpConnection();
        await this.setUpChannel();
        await this.channel.assertQueue('nnp-msg-queue');
    }
    async setUpConnection() {
        try {
            console.log('Connecting to RabbitMQ...');
            //this.connection = await amqplib.connect('amqps://fvghnida:hvQ8B8sshWkQcWEInczR3_qRaiv8LMV6@puffin.rmq2.cloudamqp.com/fvghnida');
            this.connection = await amqplib_1.default.connect('amqps://admin:ZOGmF68JCHN0CF6mYS6HV5cIE6nKOgsJ@59e5tf.stackhero-network.com:5671');
        }
        catch (err) {
            console.log(`Failed to connect: ${err}`);
            throw new Error(err);
        }
        finally {
            console.log('Connected to RabbitMQ');
        }
        this.connection.on('error', async (err) => {
            console.log(`Disconnecting due to a connection error: ${err}`);
            await this.disconnect();
        });
    }
    async setUpChannel() {
        try {
            this._channel = await this.connection.createChannel();
        }
        catch (err) {
            console.log(`Disconnecting due to channel creation failing: ${err}`);
            await this.disconnect();
            throw new Error(err);
        }
        this.channel.on('error', async (err) => {
            console.log(`Disconnecting due to a channel error: ${err}`);
            await this.disconnect();
        });
    }
    async disconnect() {
        const isClosed = await this.closeChannel();
        if (!isClosed)
            return false;
        return await this.closeConnection();
    }
    async closeChannel() {
        try {
            await this._channel?.close();
        }
        catch (err) {
            console.error(`Failed to close channel: ${err}`);
            return false;
        }
        this._channel = undefined;
        return true;
    }
    async closeConnection() {
        try {
            await this.connection?.close();
        }
        catch (err) {
            console.log(`Failed to close connection: ${err}`);
            return false;
        }
        this.connection = undefined;
        return true;
    }
}
exports.RabbitMqConnection = RabbitMqConnection;
