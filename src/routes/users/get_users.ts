import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users';

const validation_rules = [
    // body('firstname').exists().withMessage("firstname must be supplied").notEmpty().withMessage('firstname cannot be blank'),
    // body('email').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
    // body('password').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
];

const middleware: any = [
    // auth middleware here 
    // ...validation_rules,
    // validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const skip = parseInt(req.body.skip);
        const limit = parseInt(req.body.limit);
        const { filters } = req.body; 
        
        console.log("skip: ", skip); 
        console.log("limit: ", limit); 
        console.log("filters: ", filters); 

        const users = await User.find(filters).select("-password").skip(skip).limit(limit); 
        const users_count = await User.count(filters);

        console.log("users: ", users.length); 
        console.log("users_count: ", users_count); 

        res.status(200).json({ users, total: users_count });
    }
]