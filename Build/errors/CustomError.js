"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
    serializeErrors(message, field) {
        throw new Error("Method 'serializeErrors()' must be implemented.");
    }
}
exports.default = CustomError;
