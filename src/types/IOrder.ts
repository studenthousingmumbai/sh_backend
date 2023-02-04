import mongoose, { Types } from 'mongoose';
import { OrderStatus } from '../constants';

export default interface IOrder { 
    _id?: mongoose.Types.ObjectId,
    user: String, 
    listing: String, 
    beds: Array<string>, 
    status: OrderStatus, 
    payment_info: any, 
    payment_failure: boolean,
    deleted?: Boolean;
    created_at?: Date;
    updated_at?: Date;
};