// send a reset password link to the user 
import { Request, Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

import { currentUser, validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import User from '../../models/users';
import { sendEmail } from '../../utils/aws-ses';
import config from '../../config';
import { getMinutesDiff } from '../../utils/datetime';

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
        const { reset_code } = req.body;
        const user = await User.findOne({ reset_code });

        // check if a user with the supplied email exists 
        if (!user) {
            throw new BadRequestError("Reset code is invalid");
        }   

        const diff = getMinutesDiff(Date.now(), user.reset_at!);

        if(diff >= config.PASSWORD_RESET_TIMEOUT) { 
            throw new BadRequestError("Reset code is invalid");
        }

        res.status(200).send({ verified: true });
    }
]
