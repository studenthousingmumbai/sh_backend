import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import Bed from '../../models/listings';
import Listing from '../../models/listings';
import Appartment from '../../models/appartment';

// const validation_rules = [
//     body('email').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
//     body('password').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
// ];

const middleware: any = [
    // auth middleware here 
    // ...validation_rules,
    // validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        // extract data from request body
        const { listing_id } = req.body; 

        const listing = await Listing.findById(listing_id).populate('floors.appartment'); 

        console.log("listing : ", listing); 

        if(!listing) { 
            throw new BadRequestError("Listing not found!"); 
        }

        // res.status(201).send({ listing: new_listing });
        res.status(201).json({});
    }
]