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
const listings_1 = __importDefault(require("../../models/listings"));
const validation_rules = [
    (0, express_validator_1.body)('id').exists().withMessage("id must be supplied").notEmpty().withMessage('id cannot be blank'),
];
const middleware = [
    // auth middleware here 
    ...validation_rules,
    middleware_1.validateRequest
];
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, floor_number } = req.body;
        console.log("Req body: ", req.body);
        const listing = yield listings_1.default.findById(id);
        // check if a user with the supplied email exists 
        if (!listing) {
            throw new errors_1.BadRequestError(`Listing not found`);
        }
        const { floors } = listing;
        for (let floor of floors) {
            // if the floor no specified in req.body is already present in the added floors 
            // throw an error 
            if (floor.floor_number === floor_number.toString()) {
                throw new errors_1.BadRequestError(`Floor number ${floor_number} already exists!`);
            }
        }
        listing.set({
            floors: [
                ...listing.floors,
                {
                    floor_number,
                    appartments: []
                }
            ]
        });
        yield listing.save();
        res.status(201).send(listing);
    })
];
