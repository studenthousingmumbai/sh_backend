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
const beds_1 = __importDefault(require("../../models/beds"));
const datetime_1 = require("../../utils/datetime");
// const validation_rules = [
//     body('email').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
//     body('password').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
// ];
const middleware = [
// auth middleware here 
// ...validation_rules,
// validateRequest
];
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const listing = yield listings_1.default.findById(id).populate('floors.appartments');
        if (!listing) {
            throw new errors_1.BadRequestError("Listing not found!");
        }
        let all_appartments = [];
        for (let floor of listing.floors) {
            all_appartments = [
                ...all_appartments,
                ...floor.appartments
            ];
        }
        // @ts-ignore
        all_appartments = all_appartments.map((appartment) => appartment.id);
        console.log("All appartments: ", all_appartments);
        // get all beds for this listing that are in locked state and check if 2 mins have passed since they were locked 
        const beds = yield beds_1.default.find({ locked: true, appartment: { $in: all_appartments } });
        for (let bed of beds) {
            // check 
            const minute_diff = (0, datetime_1.getMinutesDiff)(Date.now(), bed.locked_at);
            // unlock the bed if 2 or more minutes have passed since it was locked
            if (minute_diff >= 2) {
                bed.set({ locked_at: 0, locked: false, locked_by: "" });
                yield bed.save();
            }
        }
        res.status(201).send(listing);
    })
];
