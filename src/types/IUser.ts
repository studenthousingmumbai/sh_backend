import mongoose from 'mongoose';

export interface IUser{ 
    _id?: mongoose.Types.ObjectId;
    firstname: string;
    lastname: string; 
    email: string; 
    password?: string;
    phone_number?: string;
    dob: Date; 
    google_signin: boolean;
    address: {
        line_1: string;
        line_2?: string;
        city: string; 
        state: string; 
        zip: number;
    }; 
    deleted?: boolean;
    created_at?: Date;
    updated_at?: Date;
};