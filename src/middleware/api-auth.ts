import { Request, Response, NextFunction } from 'express';
import { InternalServerError, NotAuthorizedError } from '../errors';
import Consumer from '../models/consumers';

export const apiAuth = async (req: Request, res: Response, next: NextFunction) => { 
    console.log("req headers", req.headers);

    const api_key = req.headers['X-API-KEY'];

    if(!api_key){
        throw new NotAuthorizedError();
    }

    // verify the api key provided 
    try{ 
        // find a consumer with the api key supplied
        const consumer = await Consumer.findOne({ api_key });
        
        if(!consumer){
            throw new NotAuthorizedError();
        }
    }   
    catch (err) {
        throw new InternalServerError();
    }

    next();
}   