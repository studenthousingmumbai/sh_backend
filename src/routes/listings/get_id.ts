import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import Listing from '../../models/listings';
import Bed from '../../models/beds'; 
import { getMinutesDiff } from '../../utils/datetime';

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
        const { id } = req.params;
        const listing  = await Listing.findById(id).populate('floors.appartments'); 

        if(!listing) { 
            throw new BadRequestError("Listing not found!"); 
        }

        let all_appartments: any = []; 

        for(let floor of listing.floors!) { 
            all_appartments = [
                ...all_appartments, 
                ...floor.appartments
            ]; 
        }

        // @ts-ignore
        all_appartments = all_appartments.map((appartment) => appartment.id); 

        console.log("All appartments: ", all_appartments);

        // get all beds for this listing that are in locked state and check if 2 mins have passed since they were locked 
        const beds = await Bed.find({ locked: true, appartment: { $in: all_appartments } }); 

        for(let bed of beds) { 
            // check 
            const minute_diff = getMinutesDiff(Date.now(), bed.locked_at!); 

            // unlock the bed if 2 or more minutes have passed since it was locked
            if(minute_diff >= 2) { 
                bed.set({ locked_at: 0, locked: false, locked_by: "" });
                await bed.save(); 
            }
        }

        res.status(201).send(listing);
    }
]