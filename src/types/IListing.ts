import mongoose from 'mongoose';

export interface IListing { 
    _id?: mongoose.Types.ObjectId;
    location: { 
        lat: string;
        long: string; 
    };
    description: string;
    rules: Array<string>;
    amenities: Array<{
        image: string,
        description: string 
    }>, 
    address: string, 
    price: number, 
    walkthrough_url: string, 
    floor_plan: { 
        image: string, 
        bounding_boxes: Array<{ 
            bed_id: string                // bed_id 
            tl: Array<number>,
            tr: Array<number>,
            bl: Array<number>,
            br: Array<number>,
        }>, 
    },
    created_at: Date,
    updated_at: Date,
    deleted: boolean 
};