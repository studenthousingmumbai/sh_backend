import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users';
import { Password } from '../../utils/password';
import Bed from '../../models/beds';
import Order from '../../models/orders';

const validation_rules = [
    // body('user').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
    // body('listing').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
];

const middleware: any = [
    // auth middleware here 
    // ...validation_rules,
    // validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const { 
            user, 
            listing, 
            bed, 
            amount, 
            appartment, 
            floor, 
            course, 
            year
        } = req.body;

        // check if the bed is not locked 

        // check if there is not already an order for this bed 
        
        // throw an error if an order has already been placed for this bed 
        
        // create a new order 

        // make the bed unavailable 
        const selected_bed = await Bed.findById(bed); 
        
        selected_bed!.set({ available: false, locked: false }); 
        await selected_bed!.save(); 

        // create new order and save 
        const order = new Order({ 
            user, 
            listing, 
            bed, 
            amount, 
            appartment, 
            floor, 
            course, 
            year 
        }); 
        await order.save(); 

        res.status(201).send({ order });
    }
];