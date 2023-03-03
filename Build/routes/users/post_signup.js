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
const constants_1 = require("../../constants");
const config_1 = __importDefault(require("../../config"));
const validation_rules = [
    (0, express_validator_1.body)('firstname').exists().withMessage("firstname must be supplied").notEmpty().withMessage('firstname cannot be blank'),
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
        const { firstname, lastname, email, password, role } = req.body;
        const user_exists = yield users_1.default.findOne({ email });
        // check if a user with the supplied email exists 
        if (user_exists) {
            throw new errors_1.BadRequestError("Email is in use");
        }
        if (admin_key) {
            console.log("This is an admin user signup");
            if (admin_key !== config_1.default.ADMIN_API_KEY) {
                throw new errors_1.BadRequestError("admin key invalid!");
            }
            // if a role has been specified 
            // create new user and save 
            let user_permissions = [];
            switch (role) {
                case constants_1.RoleTypes.ADMIN:
                    user_permissions = [constants_1.UserPermissionTypes.ALL];
                    break;
                case constants_1.RoleTypes.SUPERVISOR:
                    user_permissions = [
                        constants_1.UserPermissionTypes.VIEW_LISTING,
                        constants_1.UserPermissionTypes.VIEW_USERS,
                        constants_1.UserPermissionTypes.VIEW_ORDERS,
                        constants_1.UserPermissionTypes.VIEW_ADMIN
                    ];
                    break;
                case constants_1.RoleTypes.SUPERADMIN:
                    user_permissions = [constants_1.UserPermissionTypes.ALL];
                    break;
                default:
                    user_permissions = [
                        constants_1.UserPermissionTypes.VIEW_LISTING,
                        constants_1.UserPermissionTypes.VIEW_USERS,
                        constants_1.UserPermissionTypes.VIEW_ORDERS,
                        constants_1.UserPermissionTypes.VIEW_ADMIN
                    ];
                    break;
            }
            const new_user = new users_1.default({
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                email: email.trim(),
                password,
                role: role || constants_1.RoleTypes.SUPERVISOR,
                permissions: user_permissions,
                scope: constants_1.UserScopes.ADMIN
            });
            yield new_user.save();
            // generate access token 
            const userJWT = (0, auth_1.generateAccessToken)({
                id: new_user.id,
                email: new_user.email,
                firstname: new_user.firstname,
                lastname: new_user.lastname,
                permissions: new_user.permissions,
                role: new_user.role || constants_1.RoleTypes.SUPERVISOR,
                scope: new_user.scope
            });
            res.status(201).send({
                access_token: userJWT,
                user: {
                    id: new_user.id,
                    email: new_user.email,
                    firstname: new_user.firstname,
                    lastname: new_user.lastname,
                    role: new_user.role,
                    permissions: new_user.permissions,
                    scope: new_user.scope
                }
            });
        }
        else {
            // create new user and save 
            const new_user = new users_1.default({
                firstname,
                lastname,
                email,
                password,
                role: constants_1.RoleTypes.USER,
                scope: constants_1.UserScopes.USER
            });
            yield new_user.save();
            // generate access token 
            const userJWT = (0, auth_1.generateAccessToken)({
                id: new_user.id,
                email: new_user.email,
                firstname: new_user.firstname,
                lastname: new_user.lastname,
                scope: new_user.scope
            });
            res.status(201).send({
                access_token: userJWT,
                user: {
                    id: new_user.id,
                    email: new_user.email,
                    firstname: new_user.firstname,
                    lastname: new_user.lastname,
                    role: new_user.role,
                    scope: new_user.scope
                }
            });
        }
    })
];
