import { IOrder } from "../types/IOrder";
import mongoose, { model, Schema, Types } from 'mongoose';

const orderSchema = new Schema<IOrder>(
    {
        user: { type: Types.ObjectId, ref: 'User' }, 
        listing: { type: Types.ObjectId, ref: 'Listing'}, 
        bed_ids: { type: [String], required: true }, 
        locked: { type: Boolean, required: true }, 
        status: { type: String, required: true }, 
        payment_info: { type: mongoose.Schema.Types.Mixed, required: true }, 
        deleted: { type: Boolean, required: true } 
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