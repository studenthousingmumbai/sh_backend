import { Request, Response, NextFunction } from 'express'
import CustomError from "../errors/CustomError";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("req body: ", req.body);
    
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }

    console.log(err);

    res.status(400).send({
        errors: [{ message: "An unknown error occured" }]
    });
}