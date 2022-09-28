import CustomError from './CustomError';

export class InternalServerError extends CustomError {
    statusCode = 500;

    constructor() {
        super("Internal server error");
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}