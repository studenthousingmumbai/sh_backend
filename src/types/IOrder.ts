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
    college?: String,
    course?: String, 
    year?: String,
    floor: String, 
    payment_details?: any;
    deleted?: Boolean;
    createdAt?: Date;
    updatedAt?: Date;
};