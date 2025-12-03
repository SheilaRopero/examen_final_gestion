import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Para desarrollo - simula envío de email
export const sendOTPEmailDev = async (email, otp) => {
    console.log('\n📧 ===== EMAIL DE VERIFICACIÓN (MODO DESARROLLO) =====');
    console.log(`📨 Para: ${email}`);
    console.log(`🔢 Código OTP: ${otp}`);
    console.log(`⏰ Expira en: 5 minutos`);
    console.log('📧 ==============================================\n');
    
    return { success: true, mode: 'development' };
};

// Para producción (configurar más tarde)
export const sendOTPEmail = async (email, otp) => {
    if (process.env.NODE_ENV === 'development') {
        return await sendOTPEmailDev(email, otp);
    }
    
    // Configuración para producción
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_PORT == 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    try {
        const info = await transporter.sendMail({
            from: `"Sistema de Apuestas" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Tu código de verificación OTP',
            text: `Tu código OTP es: ${otp}. Expira en 5 minutos.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Código de Verificación</h2>
                    <p>Tu código para iniciar sesión es:</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p>Este código expirará en 5 minutos.</p>
                    <p style="color: #666; font-size: 12px;">Si no solicitaste este código, ignora este mensaje.</p>
                </div>
            `
        });
        
        console.log('✅ Email enviado:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error enviando email:', error);
        return { success: false, error: error.message };
    }
};