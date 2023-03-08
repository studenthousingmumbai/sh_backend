import { Request, Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

import { currentUser, validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users';
import { sendEmail } from '../../utils/aws-ses';
import config from '../../config';

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
        const { email } = req.params;
        const user = await User.findOne({ email, google_signin: false });

        // check if a user with the supplied email exists 
        if (!user) {
            throw new BadRequestError("User not found!");
        }   

        const account_verification_code = uuidv4();

        // send a email verification link here 
        await sendEmail(
            email, 
            config.SES_FROM_EMAIL, 
            "Student Housing account verification", 
            `
            Hello ${user.firstname}, 
            
            We have received an account creation request from you on Student housing. If you have created the account please click the below link to verify your email.
            If you haven't created the account you can safely ignore this email. 

            Click the below link to verify your account - 
            ${config.ACCOUNT_VERIFICATION_LINK}/verification/${account_verification_code}

            Best Regards, 
            Student Housing 
            `
        ); 

        user.set({ verification_code: account_verification_code }); 
        await user.save();

        res.status(200).send("Verification link sent again");
    }
]