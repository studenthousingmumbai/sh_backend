import { IUser } from './IUser';
import { IListing } from './IListing';
import mongoose from 'mongoose';

export interface IOrder { 
    _id?: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId | string | IUser; 
    listing: mongoose.Types.ObjectId | string | IListing; 
    bed_ids: Array<string>; 
    locked: boolean; 
    status: string; 
    payment_info: { 
        method: string; 
        card_number?: string; 
        upi_id?: string; 
    }; 
    deleted?: Boolean;
    created_at?: Date;
    updated_at?: Date;
};