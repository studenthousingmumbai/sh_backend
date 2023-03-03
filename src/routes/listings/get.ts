import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users';
import { Password } from '../../utils/password';
import Listing from '../../models/listings';

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
        const skip = parseInt(req.body.skip) || 0;
        const limit = parseInt(req.body.limit) || 10;
        const { filters } = req.body; 

        let listings; 

        if(req.body.skip == 0 && req.body.limit == 0) { 
            listings = await Listing.find({ ...filters }); 
        } else { 
            listings = await Listing.find({ ...filters }).skip(skip).limit(limit); 
        }
        
        const listing_count = await Listing.count(filters);

        return res.status(200).send({ listings, total: listing_count });
    }
]