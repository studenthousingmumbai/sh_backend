import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import Listing from '../../models/listings';

const validation_rules = [
    body('id').exists().withMessage("id must be supplied").notEmpty().withMessage('id cannot be blank'),
];

const middleware: any = [
    // auth middleware here 
    ...validation_rules,
    validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const { id, floor_number } = req.body;

        console.log("Req body: ", req.body); 

        const listing = await Listing.findById(id);

        // check if a user with the supplied email exists 
        if (!listing) {
            throw new BadRequestError(`Listing not found`);
        }   

        const { floors } = listing; 

        for(let floor of floors!) { 
            // if the floor no specified in req.body is already present in the added floors 
            // throw an error 
            if(floor.floor_number === floor_number.toString()){ 
                throw new BadRequestError(`Floor number ${floor_number} already exists!`); 
            }
        }

        listing.set({  
            floors: [ 
                ...listing.floors!, 
                { 
                    floor_number, 
                    appartments: []
                }
            ]
        }); 
        await listing.save();

        res.status(201).send(listing);
    }
]