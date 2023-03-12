import { Request, Response } from 'express';
import { body } from 'express-validator';

import { BadRequestError } from '../../errors';
import Listing from '../../models/listings';
import Order from '../../models/orders';
import User from '../../models/users'; 
import config from '../../config';

const stripe = require('stripe')(config.STRIPE_SECRET_KEY); 

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
        const { user, appartment, bed, floor, course, year, listing, amount, college } = req.body; 

        const existing_user = await User.findById(user); 
        const existing_listing = await Listing.findById(listing); 

        if(!existing_user) {
            throw new BadRequestError("User not found")
        }
        if(!existing_listing) { 
            throw new BadRequestError("Listing not found!");
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: config.STRIPE_CHECKOUT_SUCCESS_URL,
            cancel_url: config.STRIPE_CHECKOUT_CANCEL_URL,
            billing_address_collection: 'required',
            customer_email: existing_user.email, 
            line_items: [
                {
                    price_data: {
                        currency: 'INR',
                        product_data: {
                            name: 'Hostel fees',
                            description: `1 year term at ${existing_listing.name}`
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                user, 
                appartment, 
                bed, 
                floor, 
                listing,
                course: course || "", 
                year: year || "", 
                college: college || ""
            },
        });
      
        res.status(200).send(session.url);
    }
]; 
