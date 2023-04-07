import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users';
import { Password } from '../../utils/password';
import Order from '../../models/orders';
import Bed from '../../models/beds';
import config from '../../config';

const validation_rules = [
    body('order_id').exists().withMessage("order_id must be supplied").notEmpty().withMessage('order_id cannot be blank'),
];

const middleware: any = [
    // auth middleware here 
    ...validation_rules,
    validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const { order_id, adminKey } = req.body;

        if(adminKey !== config.ADMIN_API_KEY) { 
            throw new BadRequestError("Admin key is invalid!");
        }

        const existingOrder = await Order.findById(order_id);

        // check if a user with the supplied email exists 
        if (!existingOrder) {
            throw new BadRequestError("Order not found");
        }   

        const bed_to_unlock = await Bed.findById(existingOrder.bed); 

        if(!bed_to_unlock) {
            throw new BadRequestError("Sorry but the bed you are trying to unlock could not be found!"); 
        }

        bed_to_unlock.set({ 
            available: true, 
            locked: false 
        }); 
        await bed_to_unlock.save(); 
        
        res.status(201).send(bed_to_unlock);
    }
]