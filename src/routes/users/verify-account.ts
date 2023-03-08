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
        const { verification_code } = req.params;
        const user = await User.findOne({ verification_code, google_signin: false });

        // check if a user with the supplied email exists 
        if (!user) {
            throw new BadRequestError("User not found!");
        }   

        if(user.verified) { 
            return res.status(200).send("Account already verified!");
        }

        user.set({ verified: true }); 
        await user.save();

        res.status(200).send({ verified: true });
    }
]