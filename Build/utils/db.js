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
const mongoose_1 = __importDefault(require("mongoose"));
// import Job from '../models/job'; 
const listings_1 = __importDefault(require("../models/listings"));
const beds_1 = __importDefault(require("../models/beds"));
const orders_1 = __importDefault(require("../models/orders"));
const appartment_1 = __importDefault(require("../models/appartment"));
const local_db = 'mongodb+srv://Tanay:test12345@mern-app.o5cvu.mongodb.net/booking?retryWrites=true&w=majority';
const sh_dev_db = 'mongodb+srv://sh_admin:i7VCr4ve$tb$3d6@cluster0.hzov4yv.mongodb.net/sh_data_dev?retryWrites=true&w=majority';
function cleanDB() {
    return __awaiter(this, void 0, void 0, function* () {
        yield listings_1.default.deleteMany({});
        yield beds_1.default.deleteMany({});
        yield orders_1.default.deleteMany({});
        yield appartment_1.default.deleteMany({});
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(sh_dev_db);
        console.log('Connected to database successfully!');
        yield cleanDB();
        console.log("Database cleaned!");
        process.exit();
    }
    catch (err) {
        console.log(err);
    }
}))();
