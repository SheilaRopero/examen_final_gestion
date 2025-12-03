import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (payload) => {
    try {
        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'Valorant123', 
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );
        return token;
    } catch (error) {
        console.error('❌ Error generando token:', error);
        throw new Error('Error generando token');
    }
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'Valorant123');
    } catch (error) {
        console.error('❌ Error verificando token:', error.message);
        return null;
    }
};

export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        console.error('❌ Error decodificando token:', error);
        return null;
    }
};