import { Request, Response } from 'express';
import { currentUser } from '../../middleware';

const middleware: any = [
    currentUser
];

export default [
    ...middleware, 
    async (req: Request, res: Response) => { 
        console.log("current user: ", currentUser); 
        // @ts-ignore
        res.send({ currentUser: req.currentUser || null });
    }
]