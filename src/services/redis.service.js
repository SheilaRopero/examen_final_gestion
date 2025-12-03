import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Crear cliente Redis
const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379
    }
});

// Manejar eventos de conexión
redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err.message);
});

redisClient.on('connect', () => {
    console.log('🟢 Conectando a Redis...');
});

redisClient.on('ready', () => {
    console.log('✅ Conectado a Redis');
});

redisClient.on('end', () => {
    console.log('🔴 Desconectado de Redis');
});

// Conectar
try {
    await redisClient.connect();
} catch (err) {
    console.error('❌ Error al conectar a Redis:', err.message);
}

export default redisClient;