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
const validation_rules = [];
const middleware = [
// auth middleware here 
// ...validation_rules,
// validateRequest
];
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const skip = parseInt(req.body.skip) || 0;
        const limit = parseInt(req.body.limit) || 10;
        const { filters } = req.body;
        let orders, order_count;
        if (req.body.skip == 0 && req.body.limit == 0) {
            orders = yield orders_1.default.find(filters).populate("user bed listing appartment");
        }
        else {
            orders = yield orders_1.default.find(filters).populate("user bed listing appartment").skip(skip).limit(limit);
        }
        order_count = yield orders_1.default.count(filters);
        let orders_transformed = [];
        for (let order of orders) {
            const Order = order;
            orders_transformed.push({
                id: Order.id,
                listing: Order.listing && Order.listing.name || "",
                listing_id: Order.listing && Order.listing.id || "",
                images: Order.listing && Order.listing.images || [],
                address: Order.listing && Order.listing.address || "",
                user: Order.user && Order.user.firstname + " " + Order.user.lastname || "",
                bed: Order.bed && Order.bed._id || "",
                room_no: Order.bed && Order.bed.room_no || "",
                amount: Order.amount,
                floor: Order.floor,
                course: Order.course || "",
                year: Order.year || "",
                bed_no: Order.bed && Order.bed.bed_no || "",
                appartment: Order.appartment && Order.appartment.appartment_number || "",
                days_remaining: (0, datetime_1.getDaysLeftUntilOneYearFromMongoDBTimestamp)(Order.createdAt),
                createdAt: Order.createdAt,
                updatedAt: Order.updatedAt
            });
        }
        console.log("orders transformed", orders_transformed);
        return res.status(200).send({ orders: orders_transformed, total: order_count });
    })
];
