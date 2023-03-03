import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: parseInt(process.env.PORT as string) || 8000,
    HOST: process.env.HOST as string,
    
    JWT_KEY: process.env.JWT_KEY as string,
    DB_URI: process.env.DB_URI as string,

    AWS_REGION: process.env.AWS_REGION as string,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY as string, 
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY as string, 
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME as string,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string, 
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,

    ADMIN_API_KEY: process.env.ADMIN_API_KEY as string,

    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY as string, 
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY as string, 

    STRIPE_CHECKOUT_SUCCESS_URL: process.env.STRIPE_CHECKOUT_SUCCESS_URL as string, 
    STRIPE_CHECKOUT_CANCEL_URL: process.env.STRIPE_CHECKOUT_CANCEL_URL as string 
}; 