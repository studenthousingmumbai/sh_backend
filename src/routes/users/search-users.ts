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
        const { q: query } = req.query;
        console.log("query params: ", req.query);

        const results = await User.find({
            scope: "USER", 
            $and: [
                {
                    $or: [
                        { firstname: { $regex: '.*' + query + '.*', $options: 'i' } },
                        { lastname: { $regex: '.*' + query + '.*', $options: 'i' } },
                        { email: { $regex: '.*' + query + '.*', $options: 'i' }} 
                    ]
                }
            ]
        }).select('-password -permissions');

        res.status(200).send(results);
    }
]