import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
    try {
        console.log('🔐 Verificando token...');
        
        let token = req.headers["authorization"];
        
        if (!token) {
            console.log('❌ Token no proporcionado');
            return res.status(401).json({
                success: false,
                msg: "Acceso denegado. Token no proporcionado."
            });
        }

        // Verificar formato Bearer
        const parts = token.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            console.log('❌ Formato de token inválido');
            return res.status(401).json({
                success: false,
                msg: "Formato de token inválido. Use: Bearer <token>"
            });
        }

        token = parts[1];

        // Verificar token
        jwt.verify(token, process.env.JWT_SECRET || 'Valorant123', (error, decoded) => {
            if (error) {
                let msg = "Token inválido";
                
                if (error.name === "TokenExpiredError") {
                    msg = "Token expirado";
                    console.log('❌ Token expirado');
                } else if (error.name === "JsonWebTokenError") {
                    msg = "Token malformado";
                    console.log('❌ Token malformado');
                } else {
                    console.log('❌ Error verificación token:', error.message);
                }
                
                return res.status(401).json({
                    success: false,
                    msg: msg
                });
            }

            // Adjuntar datos del usuario al request
            req.user = decoded;
            console.log(`✅ Token válido para usuario: ${decoded.username}`);
            next();
        });

    } catch (error) {
        console.error("❌ Error en middleware de token:", error);
        return res.status(500).json({
            success: false,
            msg: "Error interno del servidor"
        });
    }
};

// Middleware para verificar roles específicos
export const verifyRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                msg: "Usuario no autenticado"
            });
        }

        if (!roles.includes(req.user.role)) {
            console.log(`❌ Permiso denegado. Rol requerido: ${roles}, Rol actual: ${req.user.role}`);
            return res.status(403).json({
                success: false,
                msg: "No tienes permisos para acceder a este recurso"
            });
        }

        console.log(`✅ Permiso concedido. Rol: ${req.user.role}`);
        next();
    };
};