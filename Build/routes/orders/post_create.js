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
const beds_1 = __importDefault(require("../../models/beds"));
const orders_1 = __importDefault(require("../../models/orders"));
const validation_rules = [
// body('user').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
// body('listing').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
];
const middleware = [
// auth middleware here 
// ...validation_rules,
// validateRequest
];
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { user, listing, bed, amount, appartment, floor, course, year } = req.body;
        // check if the bed is not locked 
        // check if there is not already an order for this bed 
        // throw an error if an order has already been placed for this bed 
        // create a new order 
        // make the bed unavailable 
        const selected_bed = yield beds_1.default.findById(bed);
        selected_bed.set({ available: false, locked: false });
        yield selected_bed.save();
        // create new order and save 
        const order = new orders_1.default({
            user,
            listing,
            bed,
            amount,
            appartment,
            floor,
            course,
            year
        });
        yield order.save();
        res.status(201).send({ order });
    })
];
