"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = exports.verifyToken = void 0;
require('dotenv').config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(data) {
    //return jwt.verify(data, process.env.JWT_KEY, policies.auth.TOKEN_EXPIRY);
    return jsonwebtoken_1.default.verify(data, process.env.JWT_KEY);
}
exports.verifyToken = verifyToken;
function generateAccessToken(data) {
    //return jwt.sign(data, process.env.JWT_KEY, { expiresIn: policies.auth.TOKEN_EXPIRY });
    return jsonwebtoken_1.default.sign(data, process.env.JWT_KEY);
}
exports.generateAccessToken = generateAccessToken;
