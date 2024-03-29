import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: parseInt(process.env.PORT as string) || 8000,
    HOST: process.env.HOST as string,
    DB_URI: process.env.DB_URI as string,

    JWT_KEY: process.env.JWT_KEY as string,
    ADMIN_API_KEY: process.env.ADMIN_API_KEY as string,

    BOOKING_TIMEOUT: parseInt(process.env.BOOKING_TIMEOUT as string) || 10, 
    PASSWORD_RESET_TIMEOUT: parseInt(process.env.PASSWORD_RESET_TIMEOUT as string) || 5, 
    
    ACCOUNT_VERIFICATION_LINK: process.env.ACCOUNT_VERIFICATION_LINK as string,

    AWS_REGION: process.env.AWS_REGION as string,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY as string, 
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY as string, 
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME as string,
    SES_FROM_EMAIL: process.env.SES_FROM_EMAIL as string, 

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string, 
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY as string, 

    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY as string, 
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string, 
    STRIPE_CHECKOUT_SUCCESS_URL: process.env.STRIPE_CHECKOUT_SUCCESS_URL as string, 
    STRIPE_CHECKOUT_CANCEL_URL: process.env.STRIPE_CHECKOUT_CANCEL_URL as string, 
    STRIPE_ENDPOINT_SECRET: process.env.STRIPE_ENDPOINT_SECRET as string,
};