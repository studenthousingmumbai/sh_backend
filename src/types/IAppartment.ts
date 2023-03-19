import mongoose from 'mongoose';

export default interface Appartment { 
    _id?: string | mongoose.Types.ObjectId, 
    appartment_number: number | string, 
    floor_number: number,
    listing_id: string | mongoose.Types.ObjectId, 
    walkthrough_url?: string,  
    floor_plan?: string,                                    // will store the floor plan image url for the appartment 
    beds?: Array<string>,                                   // will store an array of references to a bed object 
    deleted?: boolean;
    published?: boolean;                                    // whether this appartment should be shown on the user facing frontend 
    createdAt?: Date;
    updatedAt?: Date;
}; 