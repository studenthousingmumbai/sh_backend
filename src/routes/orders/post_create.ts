import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users';
import { Password } from '../../utils/password';

const validation_rules = [
    body('user').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
    body('listing').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
    body('beds').exists().withMessage("beds must be supplied").notEmpty().withMessage('beds cannot be blank').isArray().withMessage("Beds must be an array"), 
    body("payment_info").exists().withMessage("payment_info must be supplied").notEmpty().withMessage('payment_info cannot be blank')
];

const middleware: any = [
    // auth middleware here 
    ...validation_rules,
    validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const { user_id, bed_id, appartment_id, floor_number, order_id, amount, currency } = req.body;

        // check if a user with the supplied email exists 
        // if (!existingUser) {
        //     throw new BadRequestError("User not found");
        // }   



        res.status(201).send({ 
            // user: { 
            //     id: existingUser.id, 
            //     email: existingUser.email, 
            //     firstname: existingUser.firstname, 
            //     lastname: existingUser.lastname
            // } 
        });
    }
]