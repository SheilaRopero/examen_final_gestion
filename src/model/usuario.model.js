import { connection } from "../services/mongoDb.service.js"
import { ObjectId } from "mongodb";

export const getUsuarioModel = async () => {
    const conn = await connection();
    const result = await conn.collection("usuario").find({}).toArray();
    return result;
}

export const getUsuarioBySaldoModel = async (saldoMinimo) => {
    const conn = await connection();
    const result = await conn.collection("usuario").find({ 
        saldo: { $gt: parseFloat(saldoMinimo) } 
    }).toArray();
    return result;
}

export const getUsuarioByPaisModel = async (pais) => {
    const conn = await connection();
    const result = await conn.collection("usuario").find({ pais }).toArray();
    return result;
}

export const postUsuarioModel = async (info) => {
    const conn = await connection();
    const result = await conn.collection("usuario").insertOne(info);
    return result;
}

export const postUsuarioManyModel = async (info) => {
    const conn = await connection();
    const result = await conn.collection("usuario").insertMany(info);
    return result;
}

export const updateUsuarioSaldoModel = async (id, nuevoSaldo) => {
    const conn = await connection();
    const result = await conn.collection("usuario").updateOne(
        { _id: new ObjectId(id) },
        { $set: { saldo: parseFloat(nuevoSaldo) } }
    );
    return result;
}

export const incrementarUsuarioSaldoModel = async (id, incremento) => {
    const conn = await connection();
    const result = await conn.collection("usuario").updateOne(
        { _id: new ObjectId(id) },
        { $inc: { saldo: parseFloat(incremento) } }
    );
    return result;
}

export const deleteUsuarioModel = async (id) => {
    const conn = await connection();
    const result = await conn.collection("usuario").deleteOne({ 
        _id: new ObjectId(id) 
    });
    return result;
}

export const getUsuariosConMayorGananciaModel = async () => {
    const conn = await connection();
    const result = await conn.collection("apuesta").aggregate([
        {
            $match: { estado: "ganada" }
        },
        {
            $group: {
                _id: "$usuario",
                gananciaAcumulada: { $sum: "$posible_ganancia" }
            }
        },
        {
            $sort: { gananciaAcumulada: -1 }
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