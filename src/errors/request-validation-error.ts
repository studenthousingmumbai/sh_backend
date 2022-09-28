import CustomError from "./CustomError";

interface Err{ 
    msg: string;
    param: string;
}

export class RequestValidationError extends CustomError {
    statusCode = 400;
    errors = [];

    constructor(errors: any) {
        super('Invalid request parameters');
        this.errors = errors;
    }

    serializeErrors() {
        return this.errors.map((err: Err) => ({ 
            message: err.msg, 
            field: err.param 
        }));
    }
}
