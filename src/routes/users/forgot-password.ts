// send a reset password link to the user 
import { Request, Response } from 'express';
import { body } from 'express-validator';

import { currentUser, validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users';

const validation_rules = [];

const middleware: any = [
    // auth middleware here 
    // currentUser
    // ...validation_rules,
    // validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const { id } = req.params;
        const user = await User.findById(id).select('-password');

        // check if a user with the supplied email exists 
        if (!user) {
            throw new BadRequestError("User not found!");
        }   

        res.status(200).send(user);
    }
]