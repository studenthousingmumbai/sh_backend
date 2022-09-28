import CustomError from './CustomError';

export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(message: string) {
        super(message);
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}