import { MongoClient } from "mongodb";

// Configuración de conexión directamente en el script
const client = new MongoClient("mongodb://localhost:27017");

const initDatabase = async () => {
    try {
        console.log("Conectando a MongoDB...");
        await client.connect();
        const conn = client.db("casa_apuestas");
        
        // Eliminar colecciones existentes para empezar fresco
        await conn.collection("usuario").drop().catch(() => console.log("Colección usuario no existía"));
        await conn.collection("evento").drop().catch(() => console.log("Colección evento no existía"));
        await conn.collection("apuesta").drop().catch(() => console.log("Colección apuesta no existía"));
        
        // Crear colecciones
        await conn.createCollection("usuario");
        await conn.createCollection("evento");
        await conn.createCollection("apuesta");
        
        console.log("Base de datos y colecciones creadas correctamente");
        
        // Insertar datos de ejemplo - USUARIOS
        const usuarios = [
            {
                nombre: "Juan Pérez",
                correo: "juan@email.com",
                saldo: 100000,
                pais: "Colombia"
            },
            {
                nombre: "María García",
                correo: "maria@email.com", 
                saldo: 75000,
                pais: "España"
            },
            {
                nombre: "Carlos López",
                correo: "carlos@email.com",
                saldo: 50000,
                pais: "México"
            },
            {
                nombre: "Ana Martínez",
                correo: "ana@email.com",
                saldo: 120000,
                pais: "Argentina"
            },
            {
                nombre: "Pedro Rodríguez",
                correo: "pedro@email.com",
                saldo: 30000,
                pais: "Chile"
            }
        ];
        
        const usuariosInsertados = await conn.collection("usuario").insertMany(usuarios);
        console.log("Usuarios insertados:", usuariosInsertados.insertedCount);
        
        // Insertar datos de ejemplo - EVENTOS
        const eventos = [
            {
                deporte: "fútbol",
                fecha: new Date("2025-10-25"),
                cuota_local: 1.8,
                cuota_empate: 3.2,
                cuota_visitante: 4.5,
                equipos: {
                    local: "Real Madrid",
                    visitante: "Barcelona"
                }
            },
            {
                deporte: "baloncesto", 
                fecha: new Date("2025-10-26"),
                cuota_local: 2.1,
                cuota_empate: null,
                cuota_visitante: 1.9,
                equipos: {
                    local: "Lakers",
                    visitante: "Warriors"
                }
            },
            {
                deporte: "fútbol",
                fecha: new Date("2025-10-27"),
                cuota_local: 2.5,
                cuota_empate: 3.0,
                cuota_visitante: 2.8,
                equipos: {
                    local: "Manchester United",
                    visitante: "Liverpool"
                }
            },
            {
                deporte: "tenis",
                fecha: new Date("2025-10-28"),
                cuota_local: 1.7,
                cuota_empate: null,
                cuota_visitante: 2.1,
                jugadores: {
                    local: "Djokovic",
                    visitante: "Nadal"
                }
            },
            {
                deporte: "baloncesto",
                fecha: new Date("2025-10-29"),
                cuota_local: 1.9,
                cuota_empate: null,
                cuota_visitante: 1.8,
                equipos: {
                    local: "Bulls",
                    visitante: "Celtics"
                }
            }
        ];
        
        const eventosInsertados = await conn.collection("evento").insertMany(eventos);
        console.log("Eventos insertados:", eventosInsertados.insertedCount);
        
        // Obtener IDs de usuarios y eventos insertados
        const usuarioIds = Object.values(usuariosInsertados.insertedIds);
        const eventoIds = Object.values(eventosInsertados.insertedIds);
        
        // Crear apuestas que referencian los usuarios y eventos
        const apuestas = [
            {
                monto: 10000,
                posible_ganancia: 18000,
                estado: "en curso",
                usuario: usuarioIds[0],
                evento: eventoIds[0],
                fecha_apuesta: new Date()
            },
            {
                monto: 15000,
                posible_ganancia: 31500,
                estado: "ganada",
                usuario: usuarioIds[1],
                evento: eventoIds[1],
                fecha_apuesta: new Date()
            },
            {
                monto: 20000,
                posible_ganancia: 50000,
                estado: "perdida",
                usuario: usuarioIds[2],
                evento: eventoIds[2],
                fecha_apuesta: new Date()
            },
            {
                monto: 5000,
                posible_ganancia: 8500,
                estado: "en curso",
                usuario: usuarioIds[3],
                evento: eventoIds[3],
                fecha_apuesta: new Date()
            },
            {
                monto: 25000,
                posible_ganancia: 47500,
                estado: "ganada",
                usuario: usuarioIds[4],
                evento: eventoIds[4],
                fecha_apuesta: new Date()
            }
        ];
        
        const apuestasInsertadas = await conn.collection("apuesta").insertMany(apuestas);
        console.log("Apuestas insertadas:", apuestasInsertadas.insertedCount);
        
        console.log("\n=== BASE DE DATOS INICIALIZADA EXITOSAMENTE ===");
        console.log("📊 Resumen:");
        console.log("- Usuarios: 5");
        console.log("- Eventos: 5"); 
        console.log("- Apuestas: 5");
        console.log("\nPuedes empezar a probar los endpoints!");
        
    } catch (error) {
        console.error("❌ Error inicializando la base de datos:", error);
    } finally {
        await client.close();
        console.log("Conexión cerrada.");
    }
};


initDatabase();