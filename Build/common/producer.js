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
const amqplib_1 = __importDefault(require("amqplib"));
class Producer {
    constructor(queue_name, exchange_name, username = 'username', password = 'password', hostname = 'localhost', port = 5672) {
        this.connection = null;
        this.channel = null;
        this.username = username;
        this.password = password;
        this.hostname = hostname;
        this.port = port;
        this.queue_name = queue_name;
        this.exchange_name = exchange_name;
        this.binding_key = queue_name;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // connect to the rabbitmq server
                this.connection = yield amqplib_1.default.connect(`amqp://${this.username}:${this.password}@${this.hostname}:${this.port}`);
                // create a new channel 
                this.channel = yield this.connection.createChannel();
                // create an exchange with support for delayed messages
                this.channel.assertExchange(this.exchange_name, "x-delayed-message", {
                    arguments: { 'x-delayed-type': "direct" }
                });
                // bind a queue to the exchange 
                this.channel.assertQueue(this.queue_name, { durable: true });
                // bind the queue to the exchange 
                this.channel.bindQueue(this.queue_name, this.exchange_name, this.binding_key);
                console.log("Producer connected to rabbitmq broker!");
            }
            catch (err) {
                console.log(err);
                return -1;
            }
        });
    }
    sendmessage(message, delay = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            this.channel.publish(this.exchange_name, this.binding_key, Buffer.from(message), { headers: { "x-delay": delay } });
            console.log("Sent message to queue!");
        });
    }
    sendmessages(messages) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            for (let message of messages) {
                (_a = this.channel) === null || _a === void 0 ? void 0 : _a.sendToQueue(this.queue_name, Buffer.from(message));
                console.log("Sent message to queue!");
            }
        });
    }
}
exports.default = Producer;
