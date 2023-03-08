import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users';
import { Password } from '../../utils/password';
import config from '../../config';

const validation_rules = [
    body('email').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
    body('password').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
];

const middleware: any = [
    // auth middleware here 
    ...validation_rules,
    validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const admin_key = req.headers['admin-api-key']; 
        const { email, password } = req.body;
        let existingUser; 

        if(admin_key) { 
            if(admin_key !== config.ADMIN_API_KEY) {
                throw new BadRequestError("admin key invalid!");
            }

            existingUser = await User.findOne({ email, scope: 'ADMIN' });
        }
        else { 
            existingUser = await User.findOne({ email, scope: 'USER' });

            if(!existingUser!.verified) { 
                throw new BadRequestError("Please verify your account before logging in!"); 
            }
        }

        // check if a user with the supplied email exists 
        if (!existingUser) {
            console.log("User not found!");
            throw new BadRequestError("Invalid credentials");
        }   

        const passwordMatch = await Password.compare(existingUser.password as string, password);
        
        if (!passwordMatch) {
            console.log("passwords do not match");
            throw new BadRequestError("Invalid credentials");
        }

        const user_obj = { 
            id: existingUser.id, 
            email: existingUser.email, 
            firstname: existingUser.firstname, 
            lastname: existingUser.lastname, 
            role: existingUser.role, 
            scope: existingUser.scope,
            verified: existingUser.verified,
            verification_code: existingUser.verification_code
        }

        // generate access token 
        const userJWT = generateAccessToken(user_obj);

        res.status(201).send({ 
            access_token: userJWT, 
            user: user_obj
        }); 
    }
]