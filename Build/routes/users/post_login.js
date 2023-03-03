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
const express_validator_1 = require("express-validator");
const middleware_1 = require("../../middleware");
const errors_1 = require("../../errors");
const auth_1 = require("../../utils/auth");
const users_1 = __importDefault(require("../../models/users"));
const password_1 = require("../../utils/password");
const config_1 = __importDefault(require("../../config"));
const validation_rules = [
    (0, express_validator_1.body)('email').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
    (0, express_validator_1.body)('password').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16 }).withMessage("password must be minimum 8 and maximum 16 characters long"),
];
const middleware = [
    // auth middleware here 
    ...validation_rules,
    middleware_1.validateRequest
];
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const admin_key = req.headers['admin-api-key'];
        const { email, password } = req.body;
        let existingUser;
        if (admin_key) {
            if (admin_key !== config_1.default.ADMIN_API_KEY) {
                throw new errors_1.BadRequestError("admin key invalid!");
            }
            existingUser = yield users_1.default.findOne({ email, scope: 'ADMIN' });
        }
        else {
            existingUser = yield users_1.default.findOne({ email, scope: 'USER' });
        }
        // check if a user with the supplied email exists 
        if (!existingUser) {
            console.log("User not found!");
            throw new errors_1.BadRequestError("Invalid credentials");
        }
        const passwordMatch = yield password_1.Password.compare(existingUser.password, password);
        if (!passwordMatch) {
            console.log("passwords do not match");
            throw new errors_1.BadRequestError("Invalid credentials");
        }
        const user_obj = {
            id: existingUser.id,
            email: existingUser.email,
            firstname: existingUser.firstname,
            lastname: existingUser.lastname,
            role: existingUser.role,
            scope: existingUser.scope
        };
        // generate access token 
        const userJWT = (0, auth_1.generateAccessToken)(user_obj);
        res.status(201).send({
            access_token: userJWT,
            user: user_obj
        });
    })
];
