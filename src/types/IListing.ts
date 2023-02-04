import mongoose from 'mongoose';

export default interface IListing { 
    _id?: mongoose.Types.ObjectId;
    name: string, 
    gender: string, 
    location?: { 
        lat: string, 
        long: string 
    }, 
    floors?: [
        {
            floor_number: number, 
            appartments: Array<string>       // will store an array of references to an appartment object     
        }
    ], 
    images?: Array<string>,
    description: string, 
    rules?: Array<string>, 
    amenities: Array<{
        name: string, 
    }>, 
    address: string, 
    price: string, 
    deleted: boolean, 
    available: boolean,
    created_at: Date,
    updated_at: Date,
};