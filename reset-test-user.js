import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'cssa_apuestas';

async function resetTestUser() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        
        console.log('🔧 Resetear/Crear usuario testuser...');
        console.log('Base de datos:', DB_NAME);
        console.log('Colección: usuario');
        
        // Buscar usuario testuser
        const testUser = await db.collection('usuario').findOne({ 
            username: "testuser" 
        });
        
        const hashedPassword = bcrypt.hashSync("password123", 10);
        
        if (!testUser) {
            console.log('❌ Usuario testuser no encontrado. Creando uno nuevo...');
            
            const newUser = {
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
            
            const result = await db.collection('usuario').insertOne(newUser);
            console.log('\n✅ NUEVO USUARIO CREADO');
            console.log('='.repeat(40));
            console.log('👤 Username: testuser');
            console.log('🔑 Password: password123');
            console.log('📧 Email: test@example.com');
            console.log('🆔 MongoDB ID:', result.insertedId);
            
        } else {
            // Actualizar usuario existente
            console.log('✅ Usuario testuser encontrado. Actualizando...');
            
            await db.collection('usuario').updateOne(
                { username: "testuser" },
                { 
                    $set: { 
                        password: hashedPassword,
                        email: "test@example.com",
                        nombre: "Usuario",
                        apellido: "De Prueba",
                        role: "user",
                        saldo: 1000,
                        pais: "Colombia",
                        activo: true,
                        fechaActualizacion: new Date()
                    } 
                }
            );
            
            console.log('\n✅ USUARIO ACTUALIZADO');
            console.log('='.repeat(40));
            console.log('👤 Username: testuser');
            console.log('🔑 Nueva password: password123');
            console.log('📧 Email: test@example.com');
            console.log('🆔 ID existente:', testUser._id);
        }
        
        console.log('\n💡 INSTRUCCIONES:');
        console.log('   1. Inicia el servidor: npm run dev');
        console.log('   2. Ve a: http://localhost:3000/');
        console.log('   3. Usa POST /auth/login con:');
        console.log('      - Username: testuser');
        console.log('      - Password: password123');
        console.log('   4. Revisa la consola del servidor para el código OTP');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.log('\n🔧 POSIBLES SOLUCIONES:');
        console.log('   1. MongoDB no está corriendo');
        console.log('   2. Puerto 27017 está bloqueado');
        console.log('   3. No tienes permisos de escritura');
    } finally {
        await client.close();
    }
}

resetTestUser();