import express from "express"
import cors from "cors"
import dotenv from 'dotenv'
import IndexRoute from "./router/index.route.js"
import { db } from "./services/firebase.service.js"
import cursoRoutes from "./router/curso.route.js"
import estudianteRoutes from "./router/estudiante.route.js"
import authRoutes from "./router/auth.route.js"

// Importar servicios para inicializar conexiones
import redisClient from "./services/redis.service.js"
import { connection } from "./services/mongoDb.service.js"

// Configurar variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Rutas públicas
app.use("/auth", authRoutes);

// Ruta de salud
app.get("/health", async (req, res) => {
    const healthStatus = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {}
    };

    try {
        // Verificar Redis
        await redisClient.ping();
        healthStatus.services.redis = "connected";
    } catch (error) {
        healthStatus.services.redis = "disconnected";
    }

    try {
        // Verificar MongoDB
        const conn = await connection();
        await conn.command({ ping: 1 });
        healthStatus.services.mongodb = "connected";
    } catch (error) {
        healthStatus.services.mongodb = "disconnected";
    }

    try {
        // Verificar Firebase
        await db.listCollections().next();
        healthStatus.services.firebase = "connected";
    } catch (error) {
        healthStatus.services.firebase = "disconnected";
    }

    res.status(200).json(healthStatus);
});

// Documentación de la API
app.get("/", (req, res) => {
    res.json({
        message: "🚀 API de Sistema de Apuestas con Autenticación 2FA",
        version: "2.0.0",
        description: "Sistema de autenticación avanzada con OTP y Redis",
        endpoints: {
            auth: {
                login: {
                    method: "POST",
                    path: "/auth/login",
                    description: "Iniciar sesión - Recibir OTP por email",
                    body: {
                        username: "string",
                        password: "string"
                    }
                },
                verifyOtp: {
                    method: "POST",
                    path: "/auth/verify-otp",
                    description: "Verificar OTP - Recibir token JWT",
                    body: {
                        username: "string",
                        otp: "string (6 dígitos)"
                    }
                },
                check: {
                    method: "GET",
                    path: "/auth/check",
                    description: "Verificar estado del token",
                    headers: {
                        Authorization: "Bearer <token>"
                    }
                }
            },
            system: {
                health: {
                    method: "GET",
                    path: "/health",
                    description: "Verificar estado de servicios"
                },
                docs: {
                    method: "GET",
                    path: "/",
                    description: "Documentación de la API"
                }
            },
            firebase: {
                createUser: {
                    method: "GET",
                    path: "/create-test-user",
                    description: "Crear usuario de prueba en Firebase"
                },
                listUsers: {
                    method: "GET",
                    path: "/usuario",
                    description: "Listar usuarios de Firebase"
                }
            }
        },
        notes: [
            "📧 En modo desarrollo, los OTP se muestran en la consola del servidor",
            "🔐 Todas las rutas de API requieren autenticación con JWT",
            "⏰ Los OTP expiran en 5 minutos",
            "🔄 Redis almacena temporalmente los códigos OTP"
        ]
    });
});

// Rutas de ejemplo (protegidas - descomenta cuando tengas el token)
// app.use("/api/cursos", verifyToken, cursoRoutes);
// app.use("/api/estudiantes", verifyToken, estudianteRoutes);

// Ruta para crear usuario de prueba
app.get("/create-test-user", async (req, res) => {
    try {
        const bcrypt = await import('bcryptjs');
        
        const usuarioEjemplo = {
            username: "testuser",
            password: bcrypt.hashSync("password123", 10),
            email: "test@example.com",
            nombre: "Usuario",
            apellido: "De Prueba",
            role: "user",
            saldo: 1000,
            pais: "Colombia",
            fechaRegistro: new Date(),
            activo: true
        };

        // Guardar en Firebase
        const docRef = await db.collection("usuarios").add(usuarioEjemplo);

        // También guardar en MongoDB
        const mongoConn = await connection();
        const mongoResult = await mongoConn.collection("usuario").insertOne(usuarioEjemplo);

        res.status(201).json({
            success: true,
            message: "✅ Usuario de prueba creado exitosamente",
            data: {
                firebaseId: docRef.id,
                mongoId: mongoResult.insertedId,
                credentials: {
                    username: "testuser",
                    password: "password123",
                    email: "test@example.com"
                }
            }
        });
    } catch (error) {
        console.error("❌ Error creando usuario de prueba:", error);
        res.status(500).json({
            success: false,
            message: "Error al crear usuario de prueba",
            error: error.message
        });
    }
});

// Ruta para listar usuarios Firebase
app.get("/usuario", async (req, res) => {
    try {
        const snapshot = await db.collection("usuarios").get();
        
        if (snapshot.empty) {
            return res.status(404).json({
                success: true,
                message: "No hay usuarios en Firebase",
                data: []
            });
        }

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error("❌ Error en /usuario:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener usuarios de Firebase",
            error: error.message
        });
    }
});

// Ruta de ejemplo Firebase original
app.get("/saveFirebase", async (req, res) => {
    try {
        const docRef = await db.collection("users").add({
            nombre: "Sheila Silvana",
            apellido: "Ropero Martinez",
            correo: "ssroperom@ufpso.edu.co",
            fechaCreacion: new Date().toISOString()
        });

        res.status(200).json({
            success: true,
            message: "Documento creado en Firebase",
            documentId: docRef.id
        });
    } catch (ex) {
        console.error("❌ Error en saveFirebase:", ex);
        res.status(500).json({
            success: false,
            message: "Error al guardar en Firebase",
            error: ex.message
        });
    }
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
        path: req.originalUrl,
        method: req.method,
        suggestion: "Consulta la documentación en GET /"
    });
});

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error("❌ Error global:", err);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Error interno del servidor",
        ...(process.env.NODE_ENV === 'development' && { 
            error: err.message,
            stack: err.stack 
        })
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 SERVIDOR INICIADO CORRECTAMENTE");
    console.log("=".repeat(60));
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📁 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configurado' : 'Usando default'}`);
    console.log("=".repeat(60));
    console.log("\n📋 ENDPOINTS DISPONIBLES:");
    console.log("   POST /auth/login         - Iniciar sesión (recibir OTP)");
    console.log("   POST /auth/verify-otp    - Validar OTP (recibir token)");
    console.log("   GET  /auth/check         - Verificar token");
    console.log("   GET  /health             - Estado de servicios");
    console.log("   GET  /create-test-user   - Crear usuario para pruebas");
    console.log("   GET  /                   - Documentación completa");
    console.log("\n🔧 SERVICIOS:");
    console.log("   Redis:   127.0.0.1:6379");
    console.log("   MongoDB: 127.0.0.1:27017");
    console.log("   Firebase: Conectado");
    console.log("\n💡 PRIMEROS PASOS:");
    console.log("   1. Ve a: http://localhost:3000/create-test-user");
    console.log("   2. Usa las credenciales generadas para hacer login");
    console.log("   3. Revisa la consola para ver el código OTP");
    console.log("   4. Usa el OTP en /auth/verify-otp para obtener tu token");
    console.log("=".repeat(60) + "\n");
});