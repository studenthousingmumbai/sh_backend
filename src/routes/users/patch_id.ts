import { Request, Response } from 'express';
import { body } from 'express-validator';

import { currentUser, validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users';

const validation_rules = [
    body('id').exists().withMessage("id must be supplied").notEmpty().withMessage('id cannot be blank').isHexadecimal().isLength({ min: 24, max: 24 }).withMessage("invalid id"),
];

const middleware: any = [
    // auth middleware here 
    // currentUser,
    // ...validation_rules,
    // validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const { id, email, password } = req.body;
        const user = await User.findById(id);

        // check if a user with the supplied email exists 
        if (!user) {
            throw new BadRequestError("User not found!");
        }   

        // if password is set to empty string 
        if (password === "") {
            delete req.body.password;
            throw new BadRequestError("Password field cannot be set to empty string"); 
        }

        // if the user wants to update email 
        if(email !== user.email){
            // check if another account with this email exists 
            const existing_user = await User.findOne({ email });

            if(existing_user){
                throw new BadRequestError(`Another user with email: ${email} already exists`); 
            }
        }

        // update the user attributes and save to DB 
        user.set({
            ...user,
            ...req.body
        });
        await user.save();

        // generate a new access token with updated attributes 
        const userJWT = generateAccessToken({ 
            id: user.id, 
            email: user.email, 
            firstname: user.firstname, 
            lastname: user.lastname, 
            role: user.role, 
            scope: user.scope
        });

        res.status(200).send({ user, token: userJWT });
    }
]