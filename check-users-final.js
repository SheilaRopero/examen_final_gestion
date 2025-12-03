import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'casa_apuestas';  // ← CAMBIADO

async function checkUsersFinal() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        console.log('🔍 VERIFICANDO BASE DE DATOS Y USUARIOS');
        console.log('='.repeat(50));
        
        await client.connect();
        console.log('✅ Conectado a MongoDB');
        
        // Verificar si la base de datos existe
        const adminDb = client.db().admin();
        const dbs = await adminDb.listDatabases();
        const dbExists = dbs.databases.some(d => d.name === DB_NAME);
        
        if (!dbExists) {
            console.log(`❌ La base de datos "${DB_NAME}" NO EXISTE`);
            console.log('\n💡 Bases de datos disponibles:');
            dbs.databases.forEach(db => console.log(`   - ${db.name}`));
            return;
        }
        
        console.log(`✅ Base de datos "${DB_NAME}" encontrada`);
        
        const db = client.db(DB_NAME);
        
        // Verificar colecciones
        const collections = await db.listCollections().toArray();
        console.log(`\n📄 Colecciones en "${DB_NAME}":`);
        
        if (collections.length === 0) {
            console.log('   (No hay colecciones)');
        } else {
            collections.forEach(col => console.log(`   - ${col.name}`));
        }
        
        // Verificar si existe la colección 'usuario'
        const usuarioCollectionExists = collections.some(c => c.name === 'usuario');
        
        if (!usuarioCollectionExists) {
            console.log('\n❌ La colección "usuario" NO EXISTE');
            console.log('\n💡 Ejecuta: node create-user-final.js');
            return;
        }
        
        console.log('\n✅ Colección "usuario" encontrada');
        
        // Listar usuarios
        const users = await db.collection('usuario').find({}).toArray();
        
        console.log(`\n👥 USUARIOS ENCONTRADOS: ${users.length}`);
        console.log('='.repeat(50));
        
        if (users.length === 0) {
            console.log('📭 La colección "usuario" está vacía');
            console.log('\n💡 Ejecuta: node create-user-final.js');
        } else {
            users.forEach((user, index) => {
                console.log(`\n${index + 1}. ${user.username || 'Sin username'} (${user.email || 'Sin email'})`);
                console.log(`   ID: ${user._id}`);
                console.log(`   Nombre: ${user.nombre || 'No definido'} ${user.apellido || ''}`);
                console.log(`   Role: ${user.role || 'No definido'}`);
                console.log(`   Saldo: ${user.saldo || 0}`);
                if (user.password) {
                    const isHashed = user.password.startsWith('$2b$');
                    console.log(`   Password: ${isHashed ? '[HASHEADO] ' : '[TEXTO] '}${user.password.substring(0, 30)}...`);
                }
            });
        }
        
        // Buscar específicamente testuser
        const testUser = await db.collection('usuario').findOne({ username: 'testuser' });
        
        console.log('\n' + '='.repeat(50));
        if (testUser) {
            console.log('✅ Usuario "testuser" ENCONTRADO');
            console.log('🔑 Para login usa:');
            console.log(`   Username: ${testUser.username}`);
            console.log(`   Password: ${testUser.password?.startsWith('$2b$') ? 'password123 (si está hasheado)' : testUser.password}`);
        } else {
            console.log('❌ Usuario "testuser" NO encontrado');
            console.log('\n💡 Ejecuta: node create-user-final.js');
        }
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    } finally {
        await client.close();
    }
}

checkUsersFinal();