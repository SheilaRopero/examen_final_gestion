import { connection } from "../services/mongoDb.service.js"
import { ObjectId } from "mongodb";

export const getEventoModel = async () => {
    const conn = await connection();
    const result = await conn.collection("evento").find({}).toArray();
    return result;
}

export const getEventoByDeporteModel = async (deporte) => {
    const conn = await connection();
    const result = await conn.collection("evento").find({ deporte }).toArray();
    return result;
}

export const getEventoByCuotaLocalModel = async (cuotaMinima) => {
    const conn = await connection();
    const result = await conn.collection("evento").find({ 
        cuota_local: { $gt: parseFloat(cuotaMinima) } 
    }).toArray();
    return result;
}

export const postEventoModel = async (info) => {
    const conn = await connection();
    const result = await conn.collection("evento").insertOne(info);
    return result;
}

export const postEventoManyModel = async (info) => {
    const conn = await connection();
    const result = await conn.collection("evento").insertMany(info);
    return result;
}

export const updateEventoCuotaModel = async (id, campoCuota, nuevoValor) => {
    const conn = await connection();
    const updateField = {};
    updateField[campoCuota] = parseFloat(nuevoValor);
    
    const result = await conn.collection("evento").updateOne(
        { _id: new ObjectId(id) },
        { $set: updateField }
    );
    return result;
}

export const deleteEventoModel = async (id) => {
    const conn = await connection();
    const result = await conn.collection("evento").deleteOne({ 
        _id: new ObjectId(id) 
    });
    return result;
}

export const getPromedioCuotasByDeporteModel = async () => {
    const conn = await connection();
    const result = await conn.collection("evento").aggregate([
        {
            $group: {
                _id: "$deporte",
                promedio_cuota_local: { $avg: "$cuota_local" },
                promedio_cuota_empate: { $avg: "$cuota_empate" },
                promedio_cuota_visitante: { $avg: "$cuota_visitante" },
                cantidad_eventos: { $sum: 1 }
            }
        }
    ]).toArray();
    return result;
}