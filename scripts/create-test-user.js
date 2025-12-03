import { connection } from '../src/services/mongoDb.service.js';
import bcrypt from 'bcryptjs';

async function createTestUser() {
    try {
        console.log('🔄 Conectando a MongoDB...');
        const conn = await connection();
        
        // Verificar si ya existe el usuario
        console.log('🔍 Buscando usuario existente...');
        const existingUser = await conn.collection("usuario").findOne({ 
            username: "testuser" 
        });
        
        if (existingUser) {
            console.log("\n" + "=".repeat(50));
            console.log("⚠️  USUARIO DE PRUEBA YA EXISTE");
            console.log("=".repeat(50));
            console.log("👤 Username: testuser");
            console.log("🔑 Password: password123");
            console.log("📧 Email: test@example.com");
            console.log("🆔 ID:", existingUser._id);
            console.log("=".repeat(50) + "\n");
            process.exit(0);
        }
        
        // Crear usuario de prueba
        console.log('🔧 Creando usuario de prueba...');
        const hashedPassword = bcrypt.hashSync("password123", 10);
        
        const testUser = {
            username: "testuser",
            password: hashedPassword,
            email: "test@example.com",
            nombre: "Usuario",
            apellido: "De Prueba",
            role: "user",
            saldo: 1000,
            pais: "Colombia",
            fechaRegistro: new Date(),
            activo: true
        };
        
        const result = await conn.collection("usuario").insertOne(testUser);
        
        console.log("\n" + "=".repeat(50));
        console.log("✅ USUARIO DE PRUEBA CREADO EXITOSAMENTE!");
        console.log("=".repeat(50));
        console.log("👤 Username: testuser");
        console.log("🔑 Password: password123");
        console.log("📧 Email: test@example.com");
        console.log("💰 Saldo: 1000");
        console.log("🇨🇴 País: Colombia");
        console.log("🆔 MongoDB ID:", result.insertedId);
        console.log("=".repeat(50));
        console.log("\n💡 Ahora puedes:");
        console.log("   1. Iniciar el servidor: npm run dev");
        console.log("   2. Ir a: http://localhost:3000/");
        console.log("   3. Usar POST /auth/login con las credenciales");
        console.log("   4. Revisar la consola para el código OTP\n");
        
        process.exit(0);
    } catch (error) {
        console.error("\n❌ ERROR CREANDO USUARIO:");
        console.error("Mensaje:", error.message);
        console.error("\n🔧 Solución:");
        console.error("   1. Asegúrate que MongoDB esté corriendo");
        console.error("   2. Verifica la conexión en mongoDb.service.js");
        console.error("   3. Revisa que la base de datos 'apuestas_db' exista");
        process.exit(1);
    }
}

createTestUser();