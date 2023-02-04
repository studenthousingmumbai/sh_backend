import Appartment from "../types/IAppartment";
import mongoose, { model, Schema } from 'mongoose';

const appartmentSchema = new Schema<Appartment>(
    {
        appartment_number: { type: Number, required: true }, 
        floor_number: { type: Number, required: true }, 
        listing_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }, 
        walkthrough_url: { type: String, required: false }, 
        floor_plan: { type: String, required: false }, 
        deleted: { type: Boolean, required: false }, 
        published: { type: Boolean, required: false }
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

const Appartment = model<Appartment>("Appartment", appartmentSchema);
 
export default Appartment;