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
        const { available, locked, room_no, bed_no, bbox } = req.body;
        const { id } = req.params; 
        const bed = await Bed.findById(id); 

        if(!bed) {
            throw new BadRequestError("Bed not found!"); 
        }

        // check if this bed has mot been locked by someone else 
        if(req.body.locked && req.body.locked_by) { 
            if(bed.locked && bed.locked_by !== req.body.locked_by) { 
                throw new BadRequestError("The bed you are trying to book has been reserverd by another user!"); 
            }
        }   

        bed.set({ 
            available: available ? available : bed.available, 
            locked: locked ? locked : bed.locked, 
            locked_at: req.body.locked ? Date.now() : 0, 
            locked_by: req.body.locked_by ? req.body.locked_by : "", 
            room_no: room_no ? room_no : bed.room_no, 
            bed_no: bed_no ? bed_no: bed.bed_no,
            bounding_box: bbox ? bbox: bed.bounding_box, 
        }); 
        await bed.save(); 

        console.log("Updated bed and saved changes: ", bed);

        res.status(200).send(bed);
    }
]