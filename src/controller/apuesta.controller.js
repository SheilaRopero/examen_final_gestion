import { 
    postApuestaModel, 
    getApuestaByEstadoModel, 
    getApuestasWithLookupModel,
    getApuestasByDeporteModel,
    updateApuestaEstadoModel,
    getTotalApuestasByUsuarioModel 
} from "../model/apuesta.model.js"
import { ObjectId } from "mongodb";

export const getApuesta = async (req, res) => {
    try {
        const { estado, deporte } = req.query;
        
        let result;
        if (estado) {
            result = await getApuestaByEstadoModel(estado);
        } else if (deporte) {
            result = await getApuestasByDeporteModel(deporte);
        } else {
            // Mostrar todas las apuestas con lookup
            result = await getApuestasWithLookupModel();
        }
        
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const postApuesta = async (req, res) => {
    try {
        const info = req.body;
        info.usuario = new ObjectId(info.usuario);
        info.evento = new ObjectId(info.evento);
        const result = await postApuestaModel(info);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const updateEstadoApuesta = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const result = await updateApuestaEstadoModel(id, estado);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getTotalPorUsuario = async (req, res) => {
    try {
        const result = await getTotalApuestasByUsuarioModel();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export default {
    getApuesta, 
    postApuesta,
    updateEstadoApuesta,
    getTotalPorUsuario
}