import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: parseInt(process.env.PORT as string) || 8000,
    HOST: process.env.HOST as string,

    DB_URI: process.env.DB_URI as string,
}; 