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
const config_1 = __importDefault(require("../config"));
const users_1 = __importDefault(require("../models/users"));
function testUser() {
    return __awaiter(this, void 0, void 0, function* () {
        // create user 
        const new_user = new users_1.default({
            role: "customer",
            access: "",
        });
    });
}
function testOrder() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function testListing() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("starting server...");
    try {
        yield mongoose_1.default.connect(config_1.default.DB_URI);
        yield testUser();
        yield testOrder();
        yield testListing();
        console.log('Connected to database successfully!');
    }
    catch (err) {
        console.log(err);
    }
}))();
