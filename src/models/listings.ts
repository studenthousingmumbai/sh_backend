import { IListing } from "../types/IListing";
import { model, Schema } from 'mongoose';

const locationSchema = new Schema({ 
    lat: { type: String }, 
    long: { type: String }
});

const amenitiesSchema = new Schema({ 
    image: { type: String },
    description: { type: String } 
})

const floorPlanSchema = new Schema({ 
    image: { type: String }, 
    bounding_boxes: [ 
        { 
            bed_id: String, 
            tl: [Number], 
            tr: [Number], 
            bl: [Number], 
            br: [Number]
        }
    ]
});

const listingSchema = new Schema<IListing>(
    {
        location: { type: locationSchema, required: true },
        description: { type: String, required: true }, 
        rules: { type: [String], required: true }, 
        amenities: { type: [amenitiesSchema], required: false }, 
        address: { type: String, required: true }, 
        price: { type: Number, required: true }, 
        walkthrough_url: { type: String, required: true }, 
        floor_plan: { type: floorPlanSchema, required: true }, 
        deleted: { type: Boolean, required: false }
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