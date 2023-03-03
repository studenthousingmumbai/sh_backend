import { Request, Response } from 'express';
import { body } from 'express-validator';
import crypto from 'crypto';
const { OAuth2Client } = require('google-auth-library')

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users'; 
import { Password } from '../../utils/password';
import config from '../../config';
import { RoleTypes, UserPermissionTypes, UserScopes } from '../../constants';


const validation_rules = [
    body('token').exists().withMessage("token must be supplied").notEmpty().withMessage('token cannot be blank'),
];

const middleware: any = [
    // auth middleware here 
    ...validation_rules,
    validateRequest
];

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID)

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const { token } = req.body;

        console.log(req.body);

        try { 
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: config.GOOGLE_CLIENT_ID
            });

            const { name, email, picture } = ticket.getPayload();
            console.log("name, email, picture: ", name, email, picture);

            const existingUser = await User.findOne({ email });

            console.log("existing user: ", existingUser);

            if(existingUser) { 
                // generate access token 
                const userJWT = generateAccessToken({ 
                    id: existingUser.id, 
                    email: existingUser.email, 
                    firstname: existingUser.firstname, 
                    lastname: existingUser.lastname, 
                    picture, 
                    role: existingUser.role, 
                    scope: existingUser.scope
                });

                res.status(201).send({ 
                    access_token: userJWT, 
                    user: { 
                        id: existingUser.id, 
                        email: existingUser.email, 
                        firstname: existingUser.firstname, 
                        lastname: existingUser.lastname, 
                        picture, 
                        role: existingUser.role, 
                        scope: existingUser.scope
                    } 
                });
            } 
            else { 
                // console.log("Creating a new user"); 

                // create a new user here and return a new jwt
                const new_user = new User({ 
                    email, 
                    firstname: name.split(" ")[0], 
                    lastname: name.split(" ")[1], 
                    password: crypto.randomUUID(), 
                    role: RoleTypes.USER, 
                    scope: UserScopes.USER
                }); 

                await new_user.save(); 

                const userJWT = generateAccessToken({ 
                    id: new_user.id, 
                    email: new_user.email, 
                    firstname: new_user.firstname, 
                    lastname: new_user.lastname, 
                    picture, 
                    role: new_user.role, 
                    scope: new_user.scope
                });

                res.status(201).send({ 
                    access_token: userJWT, 
                    user: { 
                        id: new_user.id, 
                        email: new_user.email, 
                        firstname: new_user.firstname, 
                        lastname: new_user.lastname, 
                        picture, 
                        role: new_user.role, 
                        scope: new_user.scope
                    } 
                });
            }
        }
        catch(err){ 
            console.log("error occured: ", err);
            throw new BadRequestError("Invalid token!"); 
        }
    }
]