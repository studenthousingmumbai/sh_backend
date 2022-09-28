export default class CustomError extends Error {
    statusCode = 400;

    constructor(message: string) {
        super(message);
    }

    serializeErrors(message?: string, field?: string) {
        throw new Error("Method 'serializeErrors()' must be implemented.");
    }
}