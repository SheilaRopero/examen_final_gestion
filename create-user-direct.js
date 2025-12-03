import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'casa_apuestas';

async function createUserDirect() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔄 Conectando a MongoDB...');
        await client.connect();
        console.log('✅ Conectado a MongoDB');
        
        const db = client.db(DB_NAME);
        
        // Verificar si ya existe testuser
        const existingUser = await db.collection('usuario').findOne({ 
            username: 'testuser' 
        });
        
        if (existingUser) {
            console.log('\n' + '='.repeat(50));
            console.log('⚠️  USUARIO testuser YA EXISTE');
            console.log('='.repeat(50));
            console.log('ID:', existingUser._id);
            console.log('Password almacenada:', existingUser.password?.substring(0, 30) + '...');
            console.log('\n💡 Si la contraseña está hasheada, usa: password123');
            console.log('💡 Si está en texto, usa la contraseña que ves arriba');
            console.log('='.repeat(50));
            return;
        }
        
        console.log('🔧 Creando usuario testuser...');
        
        // PARA PRUEBAS RÁPIDAS - Usar contraseña en TEXTO PLANO
        // Esto hará que el login funcione inmediatamente
        const user = {
            username: "testuser",
            password: "password123",  // ← TEXTO PLANO (fácil para pruebas)
            email: "test@example.com",
            nombre: "Usuario",
            apellido: "De Prueba",
            role: "user",
            saldo: 1000,
            pais: "Colombia",
            fechaRegistro: new Date(),
            activo: true
        };
        
        const result = await db.collection('usuario').insertOne(user);
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ USUARIO CREADO EXITOSAMENTE!');
        console.log('='.repeat(50));
        console.log('👤 Username: testuser');
        console.log('🔑 Password: password123 (texto plano)');
        console.log('📧 Email: test@example.com');
        console.log('💰 Saldo: 1000');
        console.log('🆔 MongoDB ID:', result.insertedId);
        console.log('='.repeat(50));
        console.log('\n🎯 LISTO PARA PROBAR:');
        console.log('1. Inicia el servidor: npm run dev');
        console.log('2. Ejecuta:');
        console.log('   curl -X POST http://localhost:3000/auth/login \\');
        console.log('     -H "Content-Type: application/json" \\');
        console.log('     -d \'{"username":"testuser","password":"password123"}\'');
        console.log('\n💡 El OTP aparecerá en la consola del servidor');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.log('\n🔧 VERIFICA:');
        console.log('1. MongoDB está corriendo');
        console.log('2. La base de datos "cssa_apuestas" existe');
        console.log('3. La colección "usuario" existe');
    } finally {
        await client.close();
    }
}

createUserDirect();