import crypto from 'crypto';

export const generateOTP = () => {
    // Genera un número de 6 dígitos
    return crypto.randomInt(100000, 999999).toString();
};

export const generateSessionId = () => {
    // Genera un ID único para la sesión OTP
    return crypto.randomBytes(16).toString('hex');
};