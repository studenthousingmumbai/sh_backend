"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bbSchema = new mongoose_1.Schema({
    x: Number,
    y: Number,
    w: Number,
    h: Number
});
const bedSchema = new mongoose_1.Schema({
    appartment: { type: String, required: true },
    available: { type: Boolean, required: false, default: true },
    locked: { type: Boolean, required: false, default: false },
    bounding_box: { type: bbSchema, required: false },
    deleted: { type: Boolean, required: false, default: false },
    room_no: { type: Number, required: true },
    bed_no: { type: String, required: false }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});
const Bed = (0, mongoose_1.model)("Bed", bedSchema);
exports.default = Bed;
