
import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import Appartment from '../../models/appartment';
import { uploaded_files } from '../../utils/aws-s3';
import { s3_upload } from '../../utils/aws-s3';
import Bed from '../../models/beds';

const validation_rules = [
    body('appartment_id').exists().withMessage("appartment_id must be supplied").notEmpty().withMessage('appartment_id cannot be blank'),
];

const cpUpload = uploaded_files.fields([
    { name: 'floor_plan', maxCount: 1 }, 
]); 

const middleware: any = [
    // auth middleware here 
    cpUpload, 
    ...validation_rules,
    validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const { appartment_id, walkthrough_url } = req.body;
        const floor_plan_image_file: any = req.files && 'floor_plan' in req.files && req.files['floor_plan'][0] || null; 
        const appartment = await Appartment.findById(appartment_id);

        console.log("floor plan image file: ", floor_plan_image_file); 
        console.log("Found appartment: ", appartment); 

        // check if a user with the supplied email exists 
        if (!appartment) {
            throw new BadRequestError(`Appartment not found`);
        } 

        if(floor_plan_image_file){ 
            try { 
                const original_name = floor_plan_image_file.originalname; 
                const file_extension = original_name.split('.')[1]; 

                // upload floor_plan image to s3 & get s3 urls 
                const s3_response: any = await s3_upload(floor_plan_image_file.buffer, `listings/${appartment._id}/floor_plan.${file_extension}`); 
                console.log(s3_response); 
                appartment.set({ floor_plan: s3_response.Location });
                await appartment.save(); 
            }
            catch(err) { 
               console.log(err); 
            }
        }   

        appartment.set({ walkthrough_url }); 
        await appartment.save();
        res.status(201).send(appartment);
    }
]