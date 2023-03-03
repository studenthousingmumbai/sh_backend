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
const crypto_1 = __importDefault(require("crypto"));
const { OAuth2Client } = require('google-auth-library');
const middleware_1 = require("../../middleware");
const errors_1 = require("../../errors");
const auth_1 = require("../../utils/auth");
const users_1 = __importDefault(require("../../models/users"));
const config_1 = __importDefault(require("../../config"));
const constants_1 = require("../../constants");
const validation_rules = [
    (0, express_validator_1.body)('token').exists().withMessage("token must be supplied").notEmpty().withMessage('token cannot be blank'),
];
const middleware = [
    // auth middleware here 
    ...validation_rules,
    middleware_1.validateRequest
];
const client = new OAuth2Client(config_1.default.GOOGLE_CLIENT_ID);
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token } = req.body;
        console.log(req.body);
        try {
            const ticket = yield client.verifyIdToken({
                idToken: token,
                audience: config_1.default.GOOGLE_CLIENT_ID
            });
            const { name, email, picture } = ticket.getPayload();
            console.log("name, email, picture: ", name, email, picture);
            const existingUser = yield users_1.default.findOne({ email });
            console.log("existing user: ", existingUser);
            if (existingUser) {
                // generate access token 
                const userJWT = (0, auth_1.generateAccessToken)({
                    id: existingUser.id,
                    email: existingUser.email,
                    firstname: existingUser.firstname,
                    lastname: existingUser.lastname,
                    picture,
                    role: existingUser.role,
                    scope: existingUser.scope
                });
                res.status(201).send({
                    access_token: userJWT,
                    user: {
                        id: existingUser.id,
                        email: existingUser.email,
                        firstname: existingUser.firstname,
                        lastname: existingUser.lastname,
                        picture,
                        role: existingUser.role,
                        scope: existingUser.scope
                    }
                });
            }
            else {
                // console.log("Creating a new user"); 
                // create a new user here and return a new jwt
                const new_user = new users_1.default({
                    email,
                    firstname: name.split(" ")[0],
                    lastname: name.split(" ")[1],
                    password: crypto_1.default.randomUUID(),
                    role: constants_1.RoleTypes.USER,
                    scope: constants_1.UserScopes.USER
                });
                yield new_user.save();
                const userJWT = (0, auth_1.generateAccessToken)({
                    id: new_user.id,
                    email: new_user.email,
                    firstname: new_user.firstname,
                    lastname: new_user.lastname,
                    picture,
                    role: new_user.role,
                    scope: new_user.scope
                });
                res.status(201).send({
                    access_token: userJWT,
                    user: {
                        id: new_user.id,
                        email: new_user.email,
                        firstname: new_user.firstname,
                        lastname: new_user.lastname,
                        picture,
                        role: new_user.role,
                        scope: new_user.scope
                    }
                });
            }
        }
        catch (err) {
            console.log("error occured: ", err);
            throw new errors_1.BadRequestError("Invalid token!");
        }
    })
];
