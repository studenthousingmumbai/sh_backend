import { Request, Response } from 'express';
import { body } from 'express-validator';

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
        const { name, contact, housingProperty, referralName, referralContact, referralHousingProperty } = req.body;

        const email_body = `
            Full Name: ${name} 
            Contact: ${contact}
            Staying at property: ${housingProperty}
            Referral Name: ${referralName}
            Referral Contact: ${referralContact}
            Referrer property: ${referralHousingProperty}
        `;

        await sendEmail(config.SES_FROM_EMAIL, config.SES_FROM_EMAIL, `Student Referral from ${name}`, email_body); 

        res.status(200).send('Message sent successfully');
    }
];