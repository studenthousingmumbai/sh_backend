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
const uuid_1 = require("uuid");
const errors_1 = require("../../errors");
const listings_1 = __importDefault(require("../../models/listings"));
const aws_s3_1 = require("../../utils/aws-s3");
const aws_s3_2 = require("../../utils/aws-s3");
// const validation_rules = [
//     body('email').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
//     body('password').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
// ];
const cpUpload = aws_s3_1.uploaded_files.fields([
    { name: 'floor_plan', maxCount: 1 },
    { name: 'images', maxCount: 8 },
    { name: 'amenities_images', maxCount: 100 }
]);
const middleware = [
    // auth middleware here 
    cpUpload,
    // ...validation_rules,
    // validateRequest
];
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // extract data from request body
        let { name, description, amenities, address, price, gender, } = req.body;
        const images = [];
        const amenities_images = [];
        const listing_image_files = req.files && "images" in req.files && req.files['images'] || null;
        // check if another listing with the same name does not exist  
        const existing_listing = yield listings_1.default.findOne({ name });
        if (existing_listing) {
            throw new errors_1.BadRequestError(`Listing with name: ${name} already exists`);
        }
        if (amenities && typeof amenities === "string") {
            amenities = JSON.parse(amenities);
            console.log("amenities: ", amenities);
        }
        // TODOD - use address to find lat long 
        // construct listing object and save to db 
        const new_listing = new listings_1.default({
            name,
            description,
            address: JSON.parse(address),
            price,
            gender,
            amenities
        });
        yield new_listing.save();
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
                    const s3_response = yield (0, aws_s3_2.s3_upload)(image_file.buffer, `listings/${new_listing._id}/property/image_${(0, uuid_1.v4)()}.${file_extension}`);
                    console.log(s3_response);
                    if (s3_response) {
                        images.push(s3_response.Location);
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
            new_listing.set({ images });
            yield new_listing.save();
        }
        // res.status(201).send({ listing: new_listing });
        res.status(201).json(new_listing);
    })
];
