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

const metatagsSchema = new Schema({ 
    title: { type: String }, 
    description: { type: String }
}); 

const addressSchema = new Schema({ 
    line_1: { type: String }, 
    line_2: { type: String }, 
    city: { type: String }, 
    state: { type: String }, 
    zip: { type: String }
}); 

const faqSchema = new Schema({
    question: { type: String }, 
    answer: { type: String }
})

const occupancySchema = new Schema({ 
    price: { type: String }, 
    description: { type: String }, 
    total_beds: { type: String }, 
    period: { type: String } 
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
        publish: { type: Boolean, default: false, required: false }, 
        video_link: { type: String, required: false }, 
        total_price: { type: String, required: false }, 
        metatags: { type: [metatagsSchema], required: false },
        faqs: { type: [faqSchema], required: false },
        occupancies: { type: [occupancySchema], required: false }
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