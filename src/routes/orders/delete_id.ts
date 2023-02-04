import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users';
import { Password } from '../../utils/password';

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
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });

        // check if a user with the supplied email exists 
        if (!existingUser) {
            throw new BadRequestError("Invalid credentials");
        }   

        const passwordMatch = await Password.compare(existingUser.password as string, password);

        if (!passwordMatch) {
            throw new BadRequestError("Invalid credentials");
        }

        // generate access token 
        const userJWT = generateAccessToken({ 
            id: existingUser.id, 
            email: existingUser.email, 
            firstname: existingUser.firstname, 
            lastname: existingUser.lastname
        });

        res.status(201).send({ 
            access_token: userJWT, 
            user: { 
                id: existingUser.id, 
                email: existingUser.email, 
                firstname: existingUser.firstname, 
                lastname: existingUser.lastname
            } 
        });
    }
]