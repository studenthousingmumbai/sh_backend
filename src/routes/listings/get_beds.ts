// Get all the beds for an appartment_id 

import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import Bed from '../../models/beds';

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
        const beds = await Bed.find({ appartment: id }); 
        
        console.log("ID : ", id); 
        console.log("Beds: ", beds); 

        if(!beds || beds.length === 0) {
            return res.status(200).send([]);
        }

        res.status(200).send(beds);
    }
]