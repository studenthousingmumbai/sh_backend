import mongoose from 'mongoose';

export default interface IUser{ 
    _id?: mongoose.Types.ObjectId;
    role?: string; 
    scope?: string;
    permissions?: Array<Number | string>;
    firstname: string;
    lastname: string; 
    email: string; 
    password?: string;
    phone_number?: string;
    dob: Date; 
    google_signin?: boolean;
    address: {
        line_1: string;
        line_2?: string;
        city: string; 
        state: string; 
        zip: number;
    }; 
    father_name: string, 
    mother_name: string, 
    mother_phone: string, 
    father_phone: string, 
    pan_no: string, 
    father_pan_no: string, 
    college: string, 
    course: string, 
    year: string, 
    verified?: boolean;
    verification_code?: string;
    reset_code?: string;
    reset_at?: number; 
    deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
};