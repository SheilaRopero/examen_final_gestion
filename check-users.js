import { MongoClient } from 'mongodb';

const MONGODB_URI = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'cssa_apuestas';

async function checkUsers() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        
        console.log('🔍 Buscando usuarios en la colección "usuario"...');
        
        // Ver todos los usuarios
        const users = await db.collection('usuario').find({}).toArray();
        
        console.log(`\n📊 Total de usuarios encontrados: ${users.length}`);
        console.log('='.repeat(50));
        
        if (users.length > 0) {
            console.log('\n👥 Lista de usuarios:');
            users.forEach((user, index) => {
                console.log(`\n${index + 1}. ${user.username || 'Sin username'} (${user.email || 'Sin email'})`);
                console.log(`   ID: ${user._id}`);
                console.log(`   Nombre: ${user.nombre || 'No definido'} ${user.apellido || ''}`);
                if (user.password) {
                    const isHashed = user.password.startsWith('$2b$');
                    console.log(`   Password: ${isHashed ? '[HASHEADO] ' + user.password.substring(0, 20) + '...' : '[TEXTO] ' + user.password}`);
                    console.log(`   Longitud: ${user.password.length} caracteres`);
                }
            });
        } else {
            console.log('📭 La colección "usuario" está vacía');
        }
        
        // Buscar específicamente testuser
        const testUser = await db.collection('usuario').findOne({ 
            username: "testuser" 
        });
        
        console.log('\n' + '='.repeat(50));
        if (testUser) {
            console.log('✅ Usuario "testuser" ENCONTRADO');
            console.log('🔑 Puedes usar estas credenciales:');
            console.log(`   Username: ${testUser.username}`);
            console.log(`   Email: ${testUser.email || 'test@example.com'}`);
            
            if (testUser.password && testUser.password.startsWith('$2b$')) {
                console.log('\n⚠️  La contraseña está HASHEADADA (bcrypt)');
                console.log('   Usa "password123" como contraseña para login');
            } else if (testUser.password) {
                console.log('\n⚠️  La contraseña está en TEXTO PLANO');
                console.log(`   Usa esta contraseña: "${testUser.password}"`);
            }
            
            console.log('\n💡 Para resetear a "password123", ejecuta: node reset-test-user.js');
        } else {
            console.log('❌ Usuario "testuser" NO encontrado');
            console.log('\n💡 Para crearlo, ejecuta: node reset-test-user.js');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n🔧 Solución:');
        console.log('   1. Asegúrate que MongoDB esté corriendo');
        console.log('   2. Verifica la conexión: mongodb://127.0.0.1:27017');
        console.log('   3. Confirma que la BD "cssa_apuestas" exista');
    } finally {
        await client.close();
    }
}

checkUsers();