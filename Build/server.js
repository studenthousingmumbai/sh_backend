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
const app_1 = require("./app");
const config_1 = __importDefault(require("./config"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("starting server...");
    try {
        yield mongoose_1.default.connect(config_1.default.DB_URI);
        console.log('Connected to database successfully!');
    }
    catch (err) {
        console.log(err);
    }
    app_1.app.listen(config_1.default.PORT, () => {
        console.log(`Server listening on PORT: ${config_1.default.PORT}`);
    });
}))();
