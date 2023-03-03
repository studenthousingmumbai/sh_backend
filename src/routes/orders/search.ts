import { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../../middleware';
import { BadRequestError } from '../../errors';
import { generateAccessToken } from '../../utils/auth';
import Order from '../../models/orders';
import { getDaysLeftUntilOneYearFromMongoDBTimestamp } from '../../utils/datetime';


const validation_rules = [
    // body('firstname').exists().withMessage("firstname must be supplied").notEmpty().withMessage('firstname cannot be blank'),
    // body('email').exists().withMessage("email must be supplied").notEmpty().withMessage('email cannot be blank').isEmail().withMessage('email must be valid'),
    // body('password').exists().withMessage("password must be supplied").notEmpty().withMessage('password cannot be blank').trim().isLength({ min: 8, max: 16}).withMessage("password must be minimum 8 and maximum 16 characters long"),
];

const middleware: any = [
    // auth middleware here 
    // ...validation_rules,
    // validateRequest
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        const { q: query  } = req.query;
        console.log("query params: ", req.query);

        const results = await Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $lookup: {
                    from: 'listings',
                    localField: 'listing',
                    foreignField: '_id',
                    as: 'listing',
                },
            },
            {
                $match: {
                    $or: [
                        { 'user.firstname': { $regex: '.*' + query + '.*', $options: 'i' } },
                        { 'user.lastname': { $regex: '.*' + query + '.*', $options: 'i' } },
                        { 'listing.name': { $regex: '.*' + query + '.*', $options: 'i' } },
                        { course: { $regex: '.*' + query + '.*', $options: 'i' } },
                        { year: { $regex: '.*' + query + '.*', $options: 'i' } },
                        { floor: { $regex: '.*' + query + '.*', $options: 'i' } },
                        { amount: { $regex: '.*' + query + '.*', $options: 'i' } }
                    ],
                },
            },
            {
                $project: {
                  user: { $arrayElemAt: ["$user", 0] },
                  bed: 1,
                  listing: { $arrayElemAt: ["$listing", 0] },
                  amount: 1,
                  appartment: 1,
                  course: 1,
                  year: 1,
                  floor: 1,
                  status: 1,
                  deleted: 1, 
                  createdAt: 1,
                  updatedAt: 1
                }
            }
        ])

        let orders_transformed = []; 

        for(let order of results){ 
            const Order = order as any; 

            orders_transformed.push({ 
                listing: Order.listing && Order.listing.name || "",  
                user: Order.user && Order.user.firstname + " " + Order.user.lastname || "", 
                bed: Order.bed && Order.bed._id || "", 
                amount: Order.amount,
                floor: Order.floor, 
                course: Order.course || "",
                year: Order.year || "", 
                appartment: Order.appartment && Order.appartment._id || "", 
                days_remaining: getDaysLeftUntilOneYearFromMongoDBTimestamp(Order.createdAt), 
                createdAt: Order.createdAt, 
                updatedAt: Order.updatedAt
            }); 
        }

        res.status(200).send(orders_transformed);
    }
]; 