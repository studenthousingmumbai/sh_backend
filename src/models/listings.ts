import IListing from "../types/IListing";
import mongoose, { model, Schema } from 'mongoose';

const locationSchema = new Schema({ 
    lat: { type: String }, 
    long: { type: String }
});

const floorSchema = new Schema({ 
    floor_number: { type: String }, 
    appartments: { type: [{ type: mongoose.Types.ObjectId, ref: "Appartment" }] }
}); 

const listingSchema = new Schema<IListing>(
    {
        name: { type: String, required: true },
        location: { type: locationSchema, required: false },
        floors: { type: [floorSchema], required: false }, 
        description: { type: String, required: true }, 
        gender: { type: String, required: true }, 
        amenities: { type: [String], required: false }, 
        address: { type: String, required: true }, 
        price: { type: String, required: true }, 
        deleted: { type: Boolean, required: false, default: false },
        available: { type: Boolean, required: false, default: true }, 
        images: { type: [String], required: false }
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

const Listing = model<IListing>("Listing", listingSchema);
 
export default Listing;