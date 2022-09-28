require('dotenv').config();
import jwt from 'jsonwebtoken';

export function verifyToken(data: any) {
    //return jwt.verify(data, process.env.JWT_KEY, policies.auth.TOKEN_EXPIRY);
    return jwt.verify(data, process.env.JWT_KEY!);
}

export function generateAccessToken(data: any) {
    //return jwt.sign(data, process.env.JWT_KEY, { expiresIn: policies.auth.TOKEN_EXPIRY });
    return jwt.sign(data, process.env.JWT_KEY!);
}