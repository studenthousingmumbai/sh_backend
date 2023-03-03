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
const errors_1 = require("../../errors");
const auth_1 = require("../../utils/auth");
const users_1 = __importDefault(require("../../models/users"));
const validation_rules = [
    (0, express_validator_1.body)('id').exists().withMessage("id must be supplied").notEmpty().withMessage('id cannot be blank').isHexadecimal().isLength({ min: 24, max: 24 }).withMessage("invalid id"),
];
const middleware = [
// auth middleware here 
// currentUser,
// ...validation_rules,
// validateRequest
];
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, email, password } = req.body;
        const user = yield users_1.default.findById(id);
        // check if a user with the supplied email exists 
        if (!user) {
            throw new errors_1.BadRequestError("User not found!");
        }
        // if password is set to empty string 
        if (password === "") {
            delete req.body.password;
            throw new errors_1.BadRequestError("Password field cannot be set to empty string");
        }
        // if the user wants to update email 
        if (email !== user.email) {
            // check if another account with this email exists 
            const existing_user = yield users_1.default.findOne({ email });
            if (existing_user) {
                throw new errors_1.BadRequestError(`Another user with email: ${email} already exists`);
            }
        }
        // update the user attributes and save to DB 
        user.set(Object.assign(Object.assign({}, user), req.body));
        yield user.save();
        // generate a new access token with updated attributes 
        const userJWT = (0, auth_1.generateAccessToken)({
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            scope: user.scope
        });
        res.status(200).send({ user, token: userJWT });
    })
];
