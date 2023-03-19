import { Request, Response } from 'express';
import { body } from 'express-validator';

import { BadRequestError } from '../../errors';
import Listing from '../../models/listings';
import Order from '../../models/orders';
import User from '../../models/users'; 
import config from '../../config';
import Bed from '../../models/beds';
import { getMinutesDiff } from '../../utils/datetime';
import Appartment from '../../models/appartment';

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
        const existing_appartment = await Appartment.findById(appartment); 

        if(!existing_user) {
            throw new BadRequestError("User not found")
        }
        if(!existing_listing) { 
            throw new BadRequestError("Listing not found!");
        }
        if(!existing_appartment) { 
            throw new BadRequestError("Appartment not found!");
        }

        const bed_to_book = await Bed.findById(bed); 

        // check if the bed exists 
        if(!bed_to_book) { 
            throw new BadRequestError("The bed you selected was not found!"); 
        }
        // bed must be in locked state in order to create a payment session 
        // if the bed is not in locked state then return an error saying "session has expired" to indicate that the booking time limit has passed 
        if(!bed_to_book.locked) { 
            throw new BadRequestError("The bed can no longer be booked!"); 
        }
        
        // check whether this bed has been locked by this user or not 
        if(bed_to_book.locked_by !== user) { 
            throw new BadRequestError("This bed has been reserved by another user!"); 
        }

        // unlock the bed if 2 or more minutes have passed since it was locked and throw an error to indicate that the booking time has already passed and booking can no longer happen. 
        const minute_diff = getMinutesDiff(Date.now(), bed_to_book.locked_at!); 
        if(minute_diff >= config.BOOKING_TIMEOUT) { 
            bed_to_book.set({ locked_at: 0, locked: false, locked_by: "" });
            await bed_to_book.save(); 
            throw new BadRequestError("Booking session has expired!");
        }

        // create a payment session 
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: config.STRIPE_CHECKOUT_SUCCESS_URL,
            cancel_url: config.STRIPE_CHECKOUT_CANCEL_URL,
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ['IN'],
            },
            phone_number_collection: {
                enabled: true,
            },
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
