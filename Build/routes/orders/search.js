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
const orders_1 = __importDefault(require("../../models/orders"));
const datetime_1 = require("../../utils/datetime");
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
        const results = yield orders_1.default.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $lookup: {
                    from: 'listings',
                    localField: 'listing',
                    foreignField: '_id',
                    as: 'listing',
                },
            },
            {
                $match: {
                    $or: [
                        { 'user.firstname': { $regex: '.*' + query + '.*', $options: 'i' } },
                        { 'user.lastname': { $regex: '.*' + query + '.*', $options: 'i' } },
                        { 'listing.name': { $regex: '.*' + query + '.*', $options: 'i' } },
                        { course: { $regex: '.*' + query + '.*', $options: 'i' } },
                        { year: { $regex: '.*' + query + '.*', $options: 'i' } },
                        { floor: { $regex: '.*' + query + '.*', $options: 'i' } },
                        { amount: { $regex: '.*' + query + '.*', $options: 'i' } }
                    ],
                },
            },
            {
                $project: {
                    user: { $arrayElemAt: ["$user", 0] },
                    bed: 1,
                    listing: { $arrayElemAt: ["$listing", 0] },
                    amount: 1,
                    appartment: 1,
                    course: 1,
                    year: 1,
                    floor: 1,
                    status: 1,
                    deleted: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);
        let orders_transformed = [];
        for (let order of results) {
            const Order = order;
            orders_transformed.push({
                listing: Order.listing && Order.listing.name || "",
                user: Order.user && Order.user.firstname + " " + Order.user.lastname || "",
                bed: Order.bed && Order.bed._id || "",
                amount: Order.amount,
                floor: Order.floor,
                course: Order.course || "",
                year: Order.year || "",
                appartment: Order.appartment && Order.appartment._id || "",
                days_remaining: (0, datetime_1.getDaysLeftUntilOneYearFromMongoDBTimestamp)(Order.createdAt),
                createdAt: Order.createdAt,
                updatedAt: Order.updatedAt
            });
        }
        res.status(200).send(orders_transformed);
    })
];
