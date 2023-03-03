"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: 'User', required: true },
    bed: { type: mongoose_1.Types.ObjectId, ref: "Bed", required: true },
    listing: { type: mongoose_1.Types.ObjectId, ref: 'Listing', required: true },
    amount: { type: String, required: true },
    appartment: { type: mongoose_1.Types.ObjectId, ref: "Appartment", required: true },
    course: { type: String, required: false },
    year: { type: String, required: false },
    floor: { type: String, required: true },
    status: { type: String, required: false },
    deleted: { type: Boolean, required: false, default: false }
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
const Order = (0, mongoose_1.model)("Order", orderSchema);
exports.default = Order;
