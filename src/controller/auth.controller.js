import bcrypt from 'bcryptjs';
import { generateToken } from "../services/token.service.js";
import { generateOTP } from "../utils/otp.generator.js";
import { sendOTPEmailDev } from "../services/email.service.js";
import redisClient from "../services/redis.service.js";
import { connection } from "../services/mongoDb.service.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(`\n🔐 INTENTO DE LOGIN:`);
        console.log(`   Usuario: ${username}`);
        console.log(`   Password recibida: ${password}`);

        // Validar que vengan los datos
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                msg: "Usuario y contraseña son requeridos"
            });
        }

        // Buscar usuario en MongoDB
        const conn = await connection();
        const usuario = await conn.collection("usuario").findOne({ 
            username: username 
        });

        // Verificar si el usuario existe
        if (!usuario) {
            console.log(`❌ Usuario "${username}" NO encontrado en MongoDB`);
            return res.status(401).json({
                success: false,
                msg: "Credenciales incorrectas"
            });
        }

        console.log(`✅ Usuario encontrado en MongoDB`);
        console.log(`   ID: ${usuario._id}`);
        console.log(`   Email: ${usuario.email || 'No tiene email'}`);
        console.log(`   Password en DB: ${usuario.password?.substring(0, 30)}...`);

        // VERIFICACIÓN DE CONTRASEÑA - VERSIÓN MEJORADA
        let isValidPassword = false;
        
        // Verificar si la contraseña está hasheada (empieza con $2b$)
        if (usuario.password && usuario.password.startsWith('$2b$')) {
            console.log(`🔐 Contraseña HASHEADADA detectada`);
            try {
                // Usar bcrypt.compare (async) en lugar de compareSync
                isValidPassword = await bcrypt.compare(password, usuario.password);
                console.log(`✅ Comparación bcrypt: ${isValidPassword ? 'VÁLIDA' : 'INVÁLIDA'}`);
            } catch (bcryptError) {
                console.error(`❌ Error bcrypt:`, bcryptError.message);
                isValidPassword = false;
            }
        } else {
            console.log(`🔐 Contraseña en TEXTO PLANO detectada`);
            // Comparación directa (solo para desarrollo/pruebas)
            isValidPassword = (password === usuario.password);
            console.log(`✅ Comparación texto: ${isValidPassword ? 'VÁLIDA' : 'INVÁLIDA'}`);
        }

        if (!isValidPassword) {
            console.log(`❌ CONTRASEÑA INCORRECTA para usuario: ${username}`);
            console.log(`   Esperaba: ${usuario.password}`);
            console.log(`   Recibió: ${password}`);
            return res.status(401).json({
                success: false,
                msg: "Credenciales incorrectas"
            });
        }

        console.log(`✅ CREDENCIALES VÁLIDAS para: ${username}`);

        // Generar OTP
        const otp = generateOTP();
        const sessionId = `otp:${username}`;
        const otpData = {
            otp: otp,
            userId: usuario._id.toString(),
            username: usuario.username,
            email: usuario.email || 'test@example.com',
            expiraEn: 300, // 5 minutos en segundos
            timestamp: new Date().toISOString()
        };

        console.log(`\n🔢 OTP GENERADO: ${otp} para usuario: ${username}`);

        // Guardar OTP en Redis
        try {
            await redisClient.setEx(sessionId, 300, JSON.stringify(otpData));
            console.log(`✅ OTP guardado en Redis`);
            console.log(`   Key: ${sessionId}`);
            console.log(`   Expira en: 5 minutos (300 segundos)`);
            
            // Verificar que se guardó
            const stored = await redisClient.get(sessionId);
            if (stored) {
                console.log(`✅ OTP confirmado en Redis`);
            }
        } catch (redisError) {
            console.error('❌ ERROR guardando en Redis:', redisError.message);
            return res.status(500).json({
                success: false,
                msg: "Error interno del servidor - Redis"
            });
        }

        // Enviar OTP por email (modo desarrollo)
        const emailResult = await sendOTPEmailDev(
            usuario.email || 'test@example.com', 
            otp
        );

        if (!emailResult.success) {
            console.error('❌ Error enviando email');
        }

        // Responder sin token aún
        return res.status(200).json({
            success: true,
            msg: "✅ Código OTP enviado a tu correo",
            data: {
                username: usuario.username,
                email: usuario.email || 'test@example.com',
                hint: "🔢 Revisa la consola del servidor para ver el código OTP",
                redisKey: sessionId,
                expiresIn: "5 minutos"
            }
        });

    } catch (error) {
        console.error("\n❌ ERROR EN LOGIN:", error.message);
        console.error("Stack:", error.stack);
        return res.status(500).json({
            success: false,
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { username, otp } = req.body;
        console.log(`\n✅ VERIFICANDO OTP:`);
        console.log(`   Usuario: ${username}`);
        console.log(`   OTP recibido: ${otp}`);

        if (!username || !otp) {
            return res.status(400).json({
                success: false,
                msg: "Usuario y OTP son requeridos"
            });
        }

        const sessionId = `otp:${username}`;
        
        // Buscar OTP en Redis
        let otpDataStr;
        try {
            console.log(`🔍 Buscando OTP en Redis con key: ${sessionId}`);
            otpDataStr = await redisClient.get(sessionId);
            
            if (!otpDataStr) {
                console.log(`❌ OTP NO ENCONTRADO en Redis para: ${username}`);
                console.log(`   Razón: No existe o ya expiró (5 minutos)`);
                
                // Verificar si la key existe pero expiró
                const ttl = await redisClient.ttl(sessionId);
                console.log(`   TTL: ${ttl} segundos (${ttl === -2 ? 'KEY NO EXISTE' : ttl === -1 ? 'SIN EXPIRACIÓN' : 'EXPIRA EN ' + ttl + 's'})`);
                
                return res.status(401).json({
                    success: false,
                    msg: "OTP no encontrado o expirado. Solicita uno nuevo."
                });
            }
            
            console.log(`✅ OTP encontrado en Redis`);
            
        } catch (redisError) {
            console.error('❌ ERROR obteniendo de Redis:', redisError.message);
            return res.status(500).json({
                success: false,
                msg: "Error interno del servidor - Redis"
            });
        }

        const otpData = JSON.parse(otpDataStr);
        console.log(`📦 OTP data:`, otpData);

        // Verificar OTP
        if (otpData.otp !== otp) {
            console.log(`❌ OTP INCORRECTO`);
            console.log(`   Esperado: ${otpData.otp}`);
            console.log(`   Recibido: ${otp}`);
            return res.status(401).json({
                success: false,
                msg: "Código OTP incorrecto"
            });
        }

        console.log(`✅ OTP VÁLIDO para: ${username}`);

        // Eliminar OTP de Redis (usar una sola vez)
        try {
            await redisClient.del(sessionId);
            console.log(`✅ OTP ELIMINADO de Redis (uso único)`);
        } catch (redisError) {
            console.error('⚠️  Error eliminando OTP de Redis:', redisError.message);
        }

        // Buscar usuario completo
        const conn = await connection();
        const usuario = await conn.collection("usuario").findOne({ 
            username: username 
        });

        if (!usuario) {
            console.log(`❌ Usuario no encontrado en MongoDB después de validar OTP`);
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        console.log(`✅ Usuario confirmado en MongoDB: ${usuario.username}`);

        // Generar token JWT
        const tokenPayload = {
            id: usuario._id.toString(),
            username: usuario.username,
            email: usuario.email || 'test@example.com',
            role: usuario.role || 'user',
            nombre: usuario.nombre || usuario.username,
            saldo: usuario.saldo || 0
        };

        console.log(`🔨 Generando JWT con payload:`, tokenPayload);
        
        const token = generateToken(tokenPayload);
        
        console.log(`✅ TOKEN JWT GENERADO (${token.length} caracteres)`);
        console.log(`   Primeros 50 chars: ${token.substring(0, 50)}...`);

        // Responder con token
        return res.status(200).json({
            success: true,
            msg: "🎉 ¡Autenticación exitosa!",
            data: {
                token: token,
                expiresIn: "24h",
                tokenType: "Bearer",
                user: {
                    id: usuario._id,
                    username: usuario.username,
                    email: usuario.email || 'test@example.com',
                    nombre: usuario.nombre || usuario.username,
                    role: usuario.role || 'user',
                    saldo: usuario.saldo || 0
                },
                instructions: {
                    header: "Authorization",
                    value: `Bearer ${token.substring(0, 50)}...`,
                    usage: "Usa este header para acceder a rutas protegidas"
                }
            }
        });

    } catch (error) {
        console.error("\n❌ ERROR EN VERIFY-OTP:", error.message);
        console.error("Stack:", error.stack);
        return res.status(500).json({
            success: false,
            msg: "Error interno del servidor",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const checkAuth = async (req, res) => {
    try {
        console.log(`\n🔍 CHECK AUTH - Usuario autenticado:`);
        console.log(`   ID: ${req.user?.id}`);
        console.log(`   Username: ${req.user?.username}`);
        console.log(`   Role: ${req.user?.role}`);
        
        return res.status(200).json({
            success: true,
            msg: "✅ Usuario autenticado correctamente",
            user: req.user,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("❌ Error en checkAuth:", error.message);
        return res.status(500).json({
            success: false,
            msg: "Error interno del servidor"
        });
    }
};