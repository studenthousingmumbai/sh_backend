import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import Appartment from '../../models/appartment';
import Listing from '../../models/listings'; 

const validation_rules = [
    body('listing_id').exists().withMessage("listing_id must be supplied").notEmpty().withMessage('listing_id cannot be blank'),
    body('floor_number').exists().withMessage("floor_number must be supplied").notEmpty().withMessage('floor_number cannot be blank'),
    body('appartment_number').exists().withMessage("appartment_number must be supplied").notEmpty().withMessage('appartment_number cannot be blank'),

];

const middleware: any = [
    // auth middleware here 
    ...validation_rules,
    validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const { listing_id, floor_number, appartment_number } = req.body;
        const listing = await Listing.findById(listing_id);

        // check if a user with the supplied email exists 
        if (!listing) {
            throw new BadRequestError(`Listing not found`);
        }   

        const { floors } = listing; 
        const floors_copy = [...floors!]; 
        let floor_found = false; 

        for(let floor of floors_copy) { 
            // if the floor no specified in req.body is already present in the added floors 
            // throw an error 
            console.log("Flooor: ", floor);

            if(floor.floor_number === floor_number.toString()){ 
                floor_found = true;

                const existing_apartment = await Appartment.findOne({ listing_id, appartment_number, floor_number }); 

                if(existing_apartment){ 
                    throw new BadRequestError(`Appartment with number ${appartment_number} already exists for listing ${listing_id}!`);
                }

                const appartment = new Appartment({
                    floor_number: floor_number,
                    appartment_number,
                    listing_id, 
                    beds: []
                });
                await appartment.save(); 

                floor.appartments.push(appartment._id.toString()); 
                break; 
            }
        }

        if(!floor_found) { 
            throw new BadRequestError("Floor not found!");
        }

        listing.set({  
            floors: [ ...floors_copy ]
        });
        await listing.save();

        res.status(201).send(listing);
    }
]