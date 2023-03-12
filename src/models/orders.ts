import IOrder from "../types/IOrder";
import mongoose, { model, Schema, Types } from 'mongoose';

const orderSchema = new Schema<IOrder>(
    {
        user: { type: Types.ObjectId, ref: 'User', required: true }, 
        bed: { type: Types.ObjectId, ref: "Bed", required: true }, 
        listing: { type: Types.ObjectId, ref: 'Listing', required: true }, 
        amount: { type: String, required: true }, 
        appartment: { type: Types.ObjectId, ref: "Appartment", required: true }, 
        course: { type: String,  required: false }, 
        year: { type: String, required: false }, 
        college: { type: String, required: false },
        floor: { type: String, required: true }, 
        status: { type: String, required: false }, 
        deleted: { type: Boolean, required: false, default: false }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

const Order = model<IOrder>("Order", orderSchema);

export default Order;