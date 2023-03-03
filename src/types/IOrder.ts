import mongoose, { Types } from 'mongoose';
import { OrderStatus } from '../constants';

export default interface IOrder { 
    _id?: mongoose.Types.ObjectId,
    user: String, 
    listing: String, 
    bed: String, 
    status: String, 
    amount: String, 
    appartment: String, 
    course: String, 
    year: String,
    floor: String, 
    deleted?: Boolean;
    createdAt?: Date;
    updatedAT?: Date;
};