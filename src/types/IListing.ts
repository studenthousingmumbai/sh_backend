import mongoose from 'mongoose';

export default interface IListing { 
    _id?: mongoose.Types.ObjectId;
    name: string, 
    gender: string, 
    location?: { 
        lat: string, 
        lng: string 
    }, 
    floors?: [
        {
            floor_number: number, 
            appartments: Array<string>       // will store an array of references to an appartment object     
        }
    ], 
    metatags?: [ 
        { 
            title: string, 
            description: string 
        }
    ], 
    images?: Array<string>,
    description: string, 
    rules?: Array<string>, 
    amenities: Array<{
        name: string, 
    }>, 
    video_link?: string,
    publish?: boolean, 
    address: {
        line_1: string, 
        line_2: string, 
        city: string, 
        state: string, 
        zip: string
    }, 
    price: string,
    total_price: string, 
    deleted: boolean, 
    available: boolean,
    createdAt?: Date;
    updatedAt?: Date;
};