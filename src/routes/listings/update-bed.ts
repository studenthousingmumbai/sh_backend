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
        const { available, locked, room_no, bbox } = req.body;
        const { id } = req.params; 
        const bed = await Bed.findById(id); 

        if(!bed) {
            throw new BadRequestError("Bed not found!"); 
        }

        bed.set({ 
            available: available !== undefined ? available : bed.available, 
            locked: locked !== undefined ? locked : bed.locked, 
            locked_at: req.body.locked ? Date.now() : 0, 
            locked_by: req.body.locked_by ? req.body.locked_by : "", 
            room_no: room_no !== undefined ? room_no : bed.room_no, 
            bounding_box: bbox !== undefined ? bbox: bed.bounding_box, 
        }); 
        await bed.save(); 

        console.log("Updated bed and saved changes: ", bed);

        res.status(200).send(bed);
    }
]