import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'casa_apuestas';  // ← CAMBIADO

async function createUserFinal() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔄 Conectando a MongoDB...');
        await client.connect();
        console.log('✅ Conectado a MongoDB');
        
        const db = client.db(DB_NAME);
        
        // Verificar si la base de datos existe
        const dbs = await client.db().admin().listDatabases();
        const dbExists = dbs.databases.some(d => d.name === DB_NAME);
        
        if (!dbExists) {
            console.log(`⚠️  La base de datos "${DB_NAME}" no existe. Creándola...`);
        }
        
        // Verificar si la colección existe
        const collections = await db.listCollections().toArray();
        const collectionExists = collections.some(c => c.name === 'usuario');
        
        if (!collectionExists) {
            console.log('🔧 Creando colección "usuario"...');
            await db.createCollection('usuario');
            console.log('✅ Colección "usuario" creada');
        }
        
        // Buscar usuario testuser
        const existingUser = await db.collection('usuario').findOne({ 
            username: 'testuser' 
        });
        
        if (existingUser) {
            console.log('\n' + '='.repeat(60));
            console.log('⚠️  USUARIO testuser YA EXISTE');
            console.log('='.repeat(60));
            console.log('👤 Username:', existingUser.username);
            console.log('📧 Email:', existingUser.email || 'No tiene');
            console.log('🔑 Password (primeros 30 chars):', existingUser.password?.substring(0, 30) + '...');
            console.log('🆔 ID:', existingUser._id);
            console.log('='.repeat(60));
            console.log('\n💡 Para resetearlo, ejecuta: node reset-user-final.js');
            return;
        }
        
        // Crear usuario nuevo con contraseña en TEXTO PLANO
        console.log('🔧 Creando usuario testuser...');
        
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
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ USUARIO CREADO EXITOSAMENTE!');
        console.log('='.repeat(60));
        console.log('📁 Base de datos:', DB_NAME);
        console.log('📄 Colección: usuario');
        console.log('👤 Username: testuser');
        console.log('🔑 Password: password123 (texto plano)');
        console.log('📧 Email: test@example.com');
        console.log('💰 Saldo: 1000');
        console.log('🇨🇴 País: Colombia');
        console.log('🆔 MongoDB ID:', result.insertedId);
        console.log('='.repeat(60));
        console.log('\n🎯 LISTO PARA PROBAR:');
        console.log('1. Inicia el servidor: npm run dev');
        console.log('2. Ejecuta este comando en otra terminal:');
        console.log('');
        console.log('curl -X POST http://localhost:3000/auth/login \\');
        console.log('  -H "Content-Type: application/json" \\');
        console.log('  -d \'{"username":"testuser","password":"password123"}\'');
        console.log('');
        console.log('💡 El código OTP aparecerá en la consola del servidor');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.log('\n🔧 POSIBLES SOLUCIONES:');
        console.log('1. Verifica que MongoDB esté corriendo en puerto 27017');
        console.log('2. Abre MongoDB Compass y confirma la conexión');
        console.log('3. Asegúrate que la base de datos "casa_apuestas" exista');
    } finally {
        await client.close();
    }
}

createUserFinal();