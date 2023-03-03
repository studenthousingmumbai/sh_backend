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
class Consumer {
    constructor(queue_name, username = 'username', password = 'password', hostname = 'localhost', port = 5672) {
        this.connection = null;
        this.channel = null;
        this.username = username;
        this.password = password;
        this.hostname = hostname;
        this.port = port;
        this.queue_name = queue_name;
        this.onMessage = (msg) => { };
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // connect to the rabbitmq server
                this.connection = yield amqplib_1.default.connect(`amqp://${this.username}:${this.password}@${this.hostname}:${this.port}`);
                // create a new channel 
                this.channel = yield this.connection.createChannel();
                // fetch max 100 messages at once from the message broker 
                this.channel.prefetch(100);
                // create a new queue 
                yield this.channel.assertQueue(this.queue_name, { durable: true });
                // add the message handler 
                this.channel.consume(this.queue_name, this.onMessage);
                console.log("Consumer connected to rabbitmq broker!");
            }
            catch (err) {
                console.log(err);
                return -1;
            }
        });
    }
    // gets one single message from the message broker 
    dequeueMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.channel.get(this.queue_name);
        });
    }
}
exports.default = Consumer;
