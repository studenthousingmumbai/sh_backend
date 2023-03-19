// send a reset password link to the user 
import { Request, Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

import { currentUser, validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
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
        const { email } = req.body;
        const user = await User.findOne({ email });

        // check if a user with the supplied email exists 
        if (!user) {
            throw new BadRequestError("User not found!");
        }   

        const reset_code = uuidv4();
        user.set({ 
            reset_code,
            reset_at: Date.now()
        });
        await user.save(); 

        await sendEmail(
            email, 
            config.SES_FROM_EMAIL, 
            "Student Housing account password reset", 
            `
            Hello ${user.firstname}, 
            
            We have received a password reset request from you on Student housing. If you have created the account please click the below link to reset your password. The reset link will expire after ${config.PASSWORD_RESET_TIMEOUT} minutes. 
            If you haven't sent the request you can safely ignore this email. 

            Click the below link to reset your password - 
            ${config.ACCOUNT_VERIFICATION_LINK}/reset/${reset_code}

            Best Regards, 
            Student Housing 
            `
        );

        res.status(200).send("ent reset link");
    }
]
