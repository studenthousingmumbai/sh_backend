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
const aws_s3_1 = require("../../utils/aws-s3");
const aws_s3_2 = require("../../utils/aws-s3");
const validation_rules = [
    (0, express_validator_1.body)('appartment_id').exists().withMessage("appartment_id must be supplied").notEmpty().withMessage('appartment_id cannot be blank'),
];
const cpUpload = aws_s3_1.uploaded_files.fields([
    { name: 'floor_plan', maxCount: 1 },
]);
const middleware = [
    // auth middleware here 
    cpUpload,
    ...validation_rules,
    middleware_1.validateRequest
];
exports.default = [
    ...middleware,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { appartment_id, walkthrough_url } = req.body;
        const floor_plan_image_file = req.files && 'floor_plan' in req.files && req.files['floor_plan'][0] || null;
        const appartment = yield appartment_1.default.findById(appartment_id);
        console.log("floor plan image file: ", floor_plan_image_file);
        console.log("Found appartment: ", appartment);
        // check if a user with the supplied email exists 
        if (!appartment) {
            throw new errors_1.BadRequestError(`Appartment not found`);
        }
        if (floor_plan_image_file) {
            try {
                const original_name = floor_plan_image_file.originalname;
                const file_extension = original_name.split('.')[1];
                // upload floor_plan image to s3 & get s3 urls 
                const s3_response = yield (0, aws_s3_2.s3_upload)(floor_plan_image_file.buffer, `listings/${appartment._id}/floor_plan.${file_extension}`);
                console.log(s3_response);
                appartment.set({ floor_plan: s3_response.Location });
                yield appartment.save();
            }
            catch (err) {
                console.log(err);
            }
        }
        appartment.set({ walkthrough_url });
        yield appartment.save();
        res.status(201).send(appartment);
    })
];
