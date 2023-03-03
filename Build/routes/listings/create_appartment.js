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
const appartment_1 = __importDefault(require("../../models/appartment"));
const listings_1 = __importDefault(require("../../models/listings"));
const validation_rules = [
    (0, express_validator_1.body)('listing_id').exists().withMessage("listing_id must be supplied").notEmpty().withMessage('listing_id cannot be blank'),
    (0, express_validator_1.body)('floor_number').exists().withMessage("floor_number must be supplied").notEmpty().withMessage('floor_number cannot be blank'),
    (0, express_validator_1.body)('appartment_number').exists().withMessage("appartment_number must be supplied").notEmpty().withMessage('appartment_number cannot be blank'),
];
const middleware = [
    // auth middleware here 
    ...validation_rules,
    middleware_1.validateRequest
];
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { listing_id, floor_number, appartment_number } = req.body;
        const listing = yield listings_1.default.findById(listing_id);
        // check if a user with the supplied email exists 
        if (!listing) {
            throw new errors_1.BadRequestError(`Listing not found`);
        }
        const { floors } = listing;
        const floors_copy = [...floors];
        let floor_found = false;
        for (let floor of floors_copy) {
            // if the floor no specified in req.body is already present in the added floors 
            // throw an error 
            console.log("Flooor: ", floor);
            if (floor.floor_number === floor_number.toString()) {
                floor_found = true;
                const existing_apartment = yield appartment_1.default.findOne({ listing_id, appartment_number, floor_number });
                if (existing_apartment) {
                    throw new errors_1.BadRequestError(`Appartment with number ${appartment_number} already exists for listing ${listing_id}!`);
                }
                const appartment = new appartment_1.default({
                    floor_number: floor_number,
                    appartment_number,
                    listing_id,
                    beds: []
                });
                yield appartment.save();
                floor.appartments.push(appartment._id.toString());
                break;
            }
        }
        if (!floor_found) {
            throw new errors_1.BadRequestError("Floor not found!");
        }
        listing.set({
            floors: [...floors_copy]
        });
        yield listing.save();
        res.status(201).send(listing);
    })
];
