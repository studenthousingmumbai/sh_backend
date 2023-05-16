import { Request, Response } from 'express';
import { body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import User from '../../models/users';
import { RoleTypes, UserPermissionTypes, UserScopes } from '../../constants';
import config from '../../config';
import { sendEmail } from '../../utils/aws-ses';

const validation_rules = [
    body('firstname').exists().withMessage("firstname must be supplied").notEmpty().withMessage('firstname cannot be blank'),
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
        const { firstname, lastname, email, password, role, phoneNumber } = req.body;
        const user_exists = await User.findOne({ email });

        // check if a user with the supplied email exists 
        if (user_exists) {
            throw new BadRequestError("Email is in use");
        }   

        if(admin_key) { 
            console.log("This is an admin user signup"); 

            if(admin_key !== config.ADMIN_API_KEY) {
                throw new BadRequestError("admin key invalid!");
            }

            // if a role has been specified 
            // create new user and save 
            let user_permissions = []; 

            switch(role) { 
                case RoleTypes.ADMIN: 
                    user_permissions = [UserPermissionTypes.ALL]; 
                    break; 
                
                case RoleTypes.SUPERVISOR: 
                    user_permissions = [
                        UserPermissionTypes.VIEW_LISTING, 
                        UserPermissionTypes.VIEW_USERS, 
                        UserPermissionTypes.VIEW_ORDERS, 
                        UserPermissionTypes.VIEW_ADMIN
                    ]
                    break; 
                
                case RoleTypes.SUPERADMIN: 
                    user_permissions = [UserPermissionTypes.ALL]; 
                    break; 

                default: 
                    user_permissions = [
                        UserPermissionTypes.VIEW_LISTING, 
                        UserPermissionTypes.VIEW_USERS, 
                        UserPermissionTypes.VIEW_ORDERS, 
                        UserPermissionTypes.VIEW_ADMIN
                    ]
                    break; 
            }

            const new_user = new User({ 
                firstname: firstname.trim(), 
                lastname: lastname.trim(), 
                email: email.trim(), 
                password, 
                role: role || RoleTypes.SUPERVISOR, 
                permissions: user_permissions, 
                scope: UserScopes.ADMIN, 
                verified: false, 
                google_signin: true
            }); 
            await new_user.save();

            // generate access token 
            const userJWT = generateAccessToken({ 
                id: new_user.id, 
                email: new_user.email, 
                firstname: new_user.firstname, 
                lastname: new_user.lastname, 
                permissions: new_user.permissions, 
                role: new_user.role || RoleTypes.SUPERVISOR, 
                scope: new_user.scope
            });

            res.status(201).send({ 
                access_token: userJWT, 
                user: { 
                    id: new_user.id, 
                    email: new_user.email, 
                    firstname: new_user.firstname, 
                    lastname: new_user.lastname, 
                    role: new_user.role, 
                    permissions: new_user.permissions, 
                    scope: new_user.scope
                } 
            });
        } 
        else { 
            const account_verification_code = uuidv4();

            // send a email verification link here 
            await sendEmail(
                email, 
                config.SES_FROM_EMAIL, 
                "Student Housing account verification", 
                `
                Hello ${firstname}, 
                
                We have received an account creation request from you on Student housing. If you have created the account please click the below link to verify your email.
                If you haven't created the account you can safely ignore this email. 

                Click the below link to verify your account - 
                ${config.ACCOUNT_VERIFICATION_LINK}/verification/${account_verification_code}

                Best Regards, 
                Student Housing 
                `
            ); 

            // create new user and save 
            const new_user = new User({ 
                firstname, 
                lastname, 
                email, 
                password, 
                phone_number: phoneNumber ? phoneNumber: "",
                role: RoleTypes.USER, 
                scope: UserScopes.USER, 
                verified: false, 
                google_signin: false,
                verification_code: account_verification_code 
            }); 
            await new_user.save();

            // generate access token 
            const userJWT = generateAccessToken({ 
                id: new_user.id, 
                email: new_user.email, 
                firstname: new_user.firstname, 
                lastname: new_user.lastname, 
                scope: new_user.scope,
                verified: new_user.verified,
                verification_code: new_user.verification_code
            });

            res.status(201).send({ 
                access_token: userJWT, 
                user: { 
                    id: new_user.id, 
                    email: new_user.email, 
                    firstname: new_user.firstname, 
                    lastname: new_user.lastname, 
                    role: new_user.role, 
                    scope: new_user.scope,
                    verified: new_user.verified,
                    verification_code: new_user.verification_code
                } 
            });
        }
    }
]