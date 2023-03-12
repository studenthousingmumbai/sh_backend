import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import Bed from '../../models/listings';
import Listing from '../../models/listings';
import Appartment from '../../models/appartment';
import Order from '../../models/orders';

// const validation_rules = [
//     body('email').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
//     body('password').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
// ];

const middleware: any = [
    // auth middleware here 
    // ...validation_rules,
    // validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        // extract data from request body
        const { listing_id, year, course, college } = req.body; 

        const orders = await Order.find({ listing: listing_id, year, course, college }).populate('appartment'); 

        if(orders.length === 0) {
            return res.status(201).json({});
        }

        const result: any = { 
            // 1: { 
            //     '101': 1,
            //     '102': 3
            // }, 
            // 2: { 
            //     '201': 1,
            //     '202': 3
            // },
            // 3: { 
            //     '301': 1,
            //     '302': 3
            // }    
        }

        for(let order of orders) { 
            // @ts-ignore
            const appartment_number = order.appartment.appartment_number;

            if(!((order.floor as string) in result)){ 
                result[order.floor as string] = { 
                    [appartment_number]: 1
                };
            } else { 
                if(!result[order.floor as string][appartment_number]) { 
                    result[order.floor as string][appartment_number] = 1
                } else {    
                    result[order.floor as string][appartment_number] += 1;
                }
            }
        }

        res.status(201).json(result);
    }
]