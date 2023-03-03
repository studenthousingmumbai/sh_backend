"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const CustomError_1 = __importDefault(require("./CustomError"));
class RequestValidationError extends CustomError_1.default {
    constructor(errors) {
        super('Invalid request parameters');
        this.statusCode = 400;
        this.errors = [];
        this.errors = errors;
    }
    serializeErrors() {
        return this.errors.map((err) => ({
            message: err.msg,
            field: err.param
        }));
    }
}
exports.RequestValidationError = RequestValidationError;
