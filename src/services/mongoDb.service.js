import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'casa_apuestas';  // ← CAMBIADO

let client;
let dbConnection;

export const connection = async () => {
    try {
        if (!client) {
            client = new MongoClient(MONGODB_URI);
            await client.connect();
            console.log('✅ Conectado a MongoDB');
            console.log(`📁 Base de datos: ${MONGODB_DB}`);
        }
        
        if (!dbConnection) {
            dbConnection = client.db(MONGODB_DB);
            
            // Verificar conexión
            await dbConnection.command({ ping: 1 });
        }
        
        return dbConnection;
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        throw error;
    }
};

// Función para verificar estado
export const checkMongoDB = async () => {
    try {
        const conn = await connection();
        const stats = await conn.stats();
        return {
            connected: true,
            db: MONGODB_DB,
            collections: stats.collections,
            objects: stats.objects
        };
    } catch (error) {
        return {
            connected: false,
            error: error.message
        };
    }
};