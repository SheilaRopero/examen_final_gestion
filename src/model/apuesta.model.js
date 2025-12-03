import { connection } from "../services/mongoDb.service.js"
import { ObjectId } from "mongodb";

export const getApuestaModel = async () => {
    const conn = await connection();
    const result = await conn.collection("apuesta").find({}).toArray();
    return result;
}

export const getApuestaByEstadoModel = async (estado) => {
    const conn = await connection();
    const result = await conn.collection("apuesta").find({ estado }).toArray();
    return result;
}

export const getApuestasWithLookupModel = async () => {
    const conn = await connection();
    const result = await conn.collection("apuesta").aggregate([
        {
            $lookup: {
                from: "usuario",
                localField: "usuario",
                foreignField: "_id",
                as: "usuarioInfo"
            }
        },
        {
            $lookup: {
                from: "evento",
                localField: "evento",
                foreignField: "_id",
                as: "eventoInfo"
            }
        },
        {
            $unwind: "$usuarioInfo"
        },
        {
            $unwind: "$eventoInfo"
        }
    ]).toArray();
    return result;
}

export const getApuestasByDeporteModel = async (deporte) => {
    const conn = await connection();
    const result = await conn.collection("apuesta").aggregate([
        {
            $lookup: {
                from: "evento",
                localField: "evento",
                foreignField: "_id",
                as: "eventoInfo"
            }
        },
        {
            $unwind: "$eventoInfo"
        },
        {
            $match: {
                "eventoInfo.deporte": deporte
            }
        }
    ]).toArray();
    return result;
}

export const postApuestaModel = async (info) => {
    const conn = await connection();
    const result = await conn.collection("apuesta").insertOne(info);
    return result;
}

export const updateApuestaEstadoModel = async (id, estado) => {
    const conn = await connection();
    const result = await conn.collection("apuesta").updateOne(
        { _id: new ObjectId(id) },
        { $set: { estado } }
    );
    return result;
}

export const deleteApuestaByUsuarioModel = async (usuarioId) => {
    const conn = await connection();
    const result = await conn.collection("apuesta").deleteMany({ 
        usuario: new ObjectId(usuarioId) 
    });
    return result;
}

export const getTotalApuestasByUsuarioModel = async () => {
    const conn = await connection();
    const result = await conn.collection("apuesta").aggregate([
        {
            $group: {
                _id: "$usuario",
                totalApostado: { $sum: "$monto" },
                cantidadApuestas: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "usuario",
                localField: "_id",
                foreignField: "_id",
                as: "usuarioInfo"
            }
        },
        {
            $unwind: "$usuarioInfo"
        }
    ]).toArray();
    return result;
}