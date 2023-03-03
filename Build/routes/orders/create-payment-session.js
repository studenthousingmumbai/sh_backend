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
const errors_1 = require("../../errors");
const listings_1 = __importDefault(require("../../models/listings"));
const users_1 = __importDefault(require("../../models/users"));
const config_1 = __importDefault(require("../../config"));
const stripe = require('stripe')(config_1.default.STRIPE_SECRET_KEY);
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
        const { user, appartment, bed, floor, course, year, listing, amount } = req.body;
        const existing_user = yield users_1.default.findById(user);
        const existing_listing = yield listings_1.default.findById(listing);
        if (!existing_user) {
            throw new errors_1.BadRequestError("User not found");
        }
        if (!existing_listing) {
            throw new errors_1.BadRequestError("Listing not found!");
        }
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: config_1.default.STRIPE_CHECKOUT_SUCCESS_URL,
            cancel_url: config_1.default.STRIPE_CHECKOUT_CANCEL_URL,
            billing_address_collection: 'required',
            customer_email: existing_user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'INR',
                        product_data: {
                            name: 'Hostel fees',
                            description: `1 year term at ${existing_listing.name}`
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                user,
                appartment,
                bed,
                floor,
                listing,
                course: course || "",
                year: year || "",
            },
        });
        res.status(200).send(session.url);
    })
];
