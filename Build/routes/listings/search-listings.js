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
const listings_1 = __importDefault(require("../../models/listings"));
const validation_rules = [
// body('firstname').exists().withMessage("firstname must be supplied").notEmpty().withMessage('firstname cannot be blank'),
// body('email').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
// body('password').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
];
const middleware = [
// auth middleware here 
// ...validation_rules,
// validateRequest
];
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { q: query } = req.query;
        console.log("query params: ", req.query);
        const results = yield listings_1.default.find({
            $and: [
                {
                    $or: [
                        { name: { $regex: '.*' + query + '.*', $options: 'i' } },
                        { description: { $regex: '.*' + query + '.*', $options: 'i' } },
                        { gender: { $regex: '.*' + query + '.*', $options: 'i' } }
                    ]
                }
            ]
        });
        res.status(200).send(results);
    })
];
