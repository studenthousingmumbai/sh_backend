import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import Order from '../../models/orders'; 
import { getDaysLeftUntilOneYearFromMongoDBTimestamp } from '../../utils/datetime';

const validation_rules = [
    
];

const middleware: any = [
    // auth middleware here 
    // ...validation_rules,
    // validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const skip =  parseInt(req.body.skip) || 0;
        const limit = parseInt(req.body.limit) || 10;
        const { filters } = req.body; 

        let orders, order_count; 

        if(req.body.skip == 0 && req.body.limit == 0) { 
            orders = await Order.find(filters).populate("user bed listing appartment"); 
        } else { 
            orders = await Order.find(filters).populate("user bed listing appartment").skip(skip).limit(limit); 
        }

        order_count = await Order.count(filters);

        let orders_transformed = []; 

        for(let order of orders){ 
            const Order = order as any; 

            orders_transformed.push({ 
                id: Order.id, 
                listing: Order.listing && Order.listing.name || "",  
                listing_id: Order.listing && Order.listing.id || "", 
                images: Order.listing && Order.listing.images || [], 
                address: Order.listing && Order.listing.address || "",
                user: Order.user && Order.user.firstname + " " + Order.user.lastname || "", 
                bed: Order.bed && Order.bed._id || "", 
                room_no: Order.bed && Order.bed.room_no || "",
                amount: Order.amount,
                floor: Order.floor, 
                course: Order.course || "",
                year: Order.year || "", 
                college: Order.college || "",
                bed_no: Order.bed && Order.bed.bed_no || "", 
                appartment: Order.appartment && Order.appartment.appartment_number || "", 
                days_remaining: getDaysLeftUntilOneYearFromMongoDBTimestamp(Order.createdAt), 
                createdAt: Order.createdAt, 
                updatedAt: Order.updatedAt
            }); 
        }

        console.log("orders transformed", orders_transformed); 

        return res.status(200).send({ orders: orders_transformed, total: order_count });
    }
]; 