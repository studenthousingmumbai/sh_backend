import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors';
import { verifyToken } from '../utils/auth';

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    console.log("req body: ", req.body);
    
    if (!req.headers['authorization']) {
        throw new NotAuthorizedError();
    }

    try {
        const token = req.headers['authorization'].split(' ')[1];
        const payload = verifyToken(token);

        // @ts-ignore
        req.currentUser = payload;
    }
    catch (err) { }

    next();
}