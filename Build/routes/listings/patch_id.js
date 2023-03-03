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
const uuid_1 = require("uuid");
const errors_1 = require("../../errors");
const listings_1 = __importDefault(require("../../models/listings"));
const aws_s3_1 = require("../../utils/aws-s3");
const aws_s3_2 = require("../../utils/aws-s3");
const validation_rules = [
    (0, express_validator_1.body)('id').exists().withMessage("id must be supplied").notEmpty().withMessage('id cannot be blank'),
];
const cpUpload = aws_s3_1.uploaded_files.fields([
    { name: 'images', maxCount: 8 }
]);
const middleware = [
    // auth middleware here 
    cpUpload
    // ...validation_rules,
    // validateRequest
];
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let { id, amenities, existing_images, address } = req.body;
        const listing_image_files = req.files && "images" in req.files && req.files['images'] || null;
        const new_images = [];
        console.log("Req body: ", req.body);
        const listing = yield listings_1.default.findById(id);
        // check if a user with the supplied email exists 
        if (!listing) {
            throw new errors_1.BadRequestError("Listing not found");
        }
        if (existing_images) {
            // parse the json string since existing images will be passed in as a list of url strings
            existing_images = JSON.parse(existing_images);
            listing.set({ images: [...existing_images] });
            yield listing.save();
        }
        if (listing_image_files && listing_image_files.length > 0) {
            // upload listing images to s3 & get s3 urls 
            // @ts-ignore
            for (let i = 0; i < listing_image_files.length; i++) {
                console.log(i);
                const image_file = listing_image_files[i];
                const original_name = image_file.originalname;
                const file_extension = original_name.split('.')[1];
                console.log("Original file name: ", original_name);
                console.log("File extension: ", file_extension);
                // upload image to s3 
                try {
                    const s3_response = yield (0, aws_s3_2.s3_upload)(image_file.buffer, `listings/${listing._id}/property/image_${(0, uuid_1.v4)()}.${file_extension}`);
                    console.log(s3_response);
                    if (s3_response) {
                        new_images.push(s3_response.Location);
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            listing.set({ images: [...listing.images, ...new_images] });
            yield listing.save();
        }
        // find which images need to be deleted by comparing req.body.existing_images and listing.images
        // delete removed files from s3 here 
        delete req.body.id;
        if (req.body.address) {
            listing.set({
                address: JSON.parse(address)
            });
            delete req.body.address;
        }
        if (req.body.amenities) {
            listing.set({
                amenities: JSON.parse(amenities)
            });
            delete req.body.amenities;
        }
        listing.set(Object.assign({}, req.body));
        yield listing.save();
        res.status(201).send(listing);
    })
];
