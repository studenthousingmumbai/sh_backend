import IListing from "../types/IListing";
import mongoose, { model, Schema } from 'mongoose';

const locationSchema = new Schema({ 
    lat: { type: String }, 
    lng: { type: String }
});

const floorSchema = new Schema({ 
    floor_number: { type: String }, 
    appartments: { type: [{ type: mongoose.Types.ObjectId, ref: "Appartment" }] }
}); 

const addressSchema = new Schema({ 
    line_1: { type: String }, 
    line_2: { type: String }, 
    city: { type: String }, 
    state: { type: String }, 
    zip: { type: String }
}); 

const listingSchema = new Schema<IListing>(
    {
        name: { type: String, required: true },
        location: { type: locationSchema, required: false },
        floors: { type: [floorSchema], required: false }, 
        description: { type: String, required: true }, 
        gender: { type: String, required: true }, 
        amenities: { type: [String], required: false }, 
        address: { type: addressSchema, required: true }, 
        price: { type: String, required: true }, 
        deleted: { type: Boolean, required: false, default: false },
        available: { type: Boolean, required: false, default: true }, 
        images: { type: [String], required: false }, 
        publish: { type: Boolean, default: false, required: false }
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