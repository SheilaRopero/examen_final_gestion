import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'cssa_apuestas';

async function resetUserSimple() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        
        console.log('🔄 Reseteando usuario testuser...');
        
        // Primero eliminar si existe
        await db.collection('usuario').deleteOne({ username: 'testuser' });
        
        // Crear nuevo con contraseña en texto plano
        const user = {
            username: "testuser",
            password: "password123",  // TEXTO PLANO
            email: "test@example.com",
            nombre: "Usuario",
            apellido: "De Prueba",
            role: "user",
            saldo: 1000,
            pais: "Colombia",
            fechaRegistro: new Date(),
            activo: true
        };
        
        await db.collection('usuario').insertOne(user);
        
        console.log('\n✅ USUARIO RESETEADO!');
        console.log('🔑 Usa: username=testuser, password=password123');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
    }
}

resetUserSimple();