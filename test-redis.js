import { createClient } from 'redis';

async function testRedis() {
    console.log('🔍 Probando conexión a Redis...');
    console.log('Host: 127.0.0.1:6379');
    
    const client = createClient({
        socket: {
            host: '127.0.0.1',
            port: 6379
        }
    });
    
    client.on('error', (err) => {
        console.log('❌ Redis Client Error:', err.message);
    });
    
    client.on('connect', () => {
        console.log('🟢 Conectando a Redis...');
    });
    
    try {
        await client.connect();
        console.log('✅ ¡Conectado a Redis exitosamente!');
        
        // Probar comandos básicos
        console.log('\n🧪 Probando operaciones Redis...');
        await client.set('test_key', 'Hola Redis desde Node.js!');
        const value = await client.get('test_key');
        console.log(`📊 GET test_key: "${value}"`);
        
        // Probar expiración
        await client.setEx('temp_key', 10, 'Este valor expira en 10 segundos');
        console.log('⏰ Key temporal creada (expira en 10s)');
        
        // Listar algunas keys
        const keys = await client.keys('*');
        console.log(`🗝️  Keys en Redis: ${keys.length} keys encontradas`);
        if (keys.length > 0) {
            console.log('   Ejemplos:', keys.slice(0, 5).join(', '));
        }
        
        // Limpiar
        await client.del('test_key');
        console.log('🧹 Test key eliminada');
        
        await client.quit();
        console.log('\n✅ Prueba completada. Redis funciona correctamente.');
        
    } catch (error) {
        console.error('\n❌ Error conectando a Redis:', error.message);
        console.log('\n🔧 SOLUCIÓN:');
        console.log('   1. Asegúrate que redis-server.exe esté ejecutándose');
        console.log('   2. Debes ver una ventana de Redis con el texto:');
        console.log('      "The server is now ready to accept connections"');
        console.log('   3. Verifica que no haya otro programa usando el puerto 6379');
        console.log('   4. Intenta reiniciar Redis');
    }
}

testRedis();