import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'cssa_apuestas';

async function createUserNow() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔄 Conectando a MongoDB...');
        await client.connect();
        console.log('✅ Conectado a MongoDB');
        
        const db = client.db(DB_NAME);
        
        // Primero eliminar si existe
        await db.collection('usuario').deleteOne({ username: 'testuser' });
        console.log('🧹 Usuario antiguo eliminado (si existía)');
        
        // Crear nuevo con contraseña en TEXTO PLANO (fácil para pruebas)
        const user = {
            username: "testuser",
            password: "password123",  // ← TEXTO PLANO
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
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ USUARIO LISTO PARA PRUEBAS!');
        console.log('='.repeat(60));
        console.log('👤 Username: testuser');
        console.log('🔑 Password: password123 (texto plano)');
        console.log('📧 Email: test@example.com');
        console.log('💰 Saldo: 1000');
        console.log('🆔 MongoDB ID:', result.insertedId);
        console.log('='.repeat(60));
        console.log('\n🎯 AHORA EJECUTA ESTO EN OTRA TERMINAL:');
        console.log('curl -X POST http://localhost:3000/auth/login \\');
        console.log('  -H "Content-Type: application/json" \\');
        console.log('  -d \'{"username":"testuser","password":"password123"}\'');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    } finally {
        await client.close();
    }
}

createUserNow();