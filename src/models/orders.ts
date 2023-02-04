import IOrder from "../types/IOrder";
import mongoose, { model, Schema, Types } from 'mongoose';

const orderSchema = new Schema<IOrder>(
    {
        user: { type: Types.ObjectId, ref: 'User', required: true }, 
        listing: { type: Types.ObjectId, ref: 'Listing', required: true }, 
        beds: { type: [Types.ObjectId], required: true }, 
        payment_info: { type: mongoose.Schema.Types.Mixed, required: true }, 
        status: { type: Number, required: false }, 
        deleted: { type: Boolean, required: false }, 
        payment_failure: { type: Boolean, required: false } 
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