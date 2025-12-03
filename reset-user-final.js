import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'casa_apuestas';  // ← CAMBIADO

async function resetUserFinal() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔄 Conectando a MongoDB...');
        await client.connect();
        console.log('✅ Conectado a MongoDB');
        
        const db = client.db(DB_NAME);
        
        console.log('🔧 Reseteando usuario testuser...');
        
        // Eliminar si existe
        const deleteResult = await db.collection('usuario').deleteOne({ username: 'testuser' });
        console.log(`🧹 ${deleteResult.deletedCount} usuario(s) eliminado(s)`);
        
        // Crear nuevo
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
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ USUARIO RESETEADO!');
        console.log('='.repeat(50));
        console.log('👤 Username: testuser');
        console.log('🔑 Password: password123');
        console.log('📧 Email: test@example.com');
        console.log('🆔 Nuevo ID:', result.insertedId);
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    } finally {
        await client.close();
    }
}

resetUserFinal();