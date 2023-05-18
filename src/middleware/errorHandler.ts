import { Request, Response, NextFunction } from 'express'
import CustomError from "../errors/CustomError";
import multer from 'multer';
import { BSONError } from 'bson';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("req body: ", req.body);
    console.log(err);
    
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }

    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        if (err.code === 'LIMIT_FILE_SIZE') {
          // Handle the file size limit error
          return res.status(413).json({ errors: [{ message: 'File size limit exceeded'}] });
        }
        if(err.code === 'LIMIT_UNEXPECTED_FILE') { 
            return res.status(413).json({ errors: [{ message: 'No of files uploaded exceeded upload limit'}] });
        }
        // Handle other Multer errors
        return res.status(400).json({ errors: [{ message: 'An error occurred while uploading'}] });
    }

    if (err instanceof BSONError) { 
        return res.status(400).json({ errors: [{ message: 'Resource identifiers must be strings of 24 hex characters'}] });
    }

    res.status(400).send({ errors: [{ message: "An unknown error occured" }] });
}