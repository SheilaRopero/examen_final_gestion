import { 
    getEventoModel, 
    postEventoManyModel, 
    postEventoModel, 
    getEventoByDeporteModel,
    getEventoByCuotaLocalModel,
    updateEventoCuotaModel,
    deleteEventoModel,
    getPromedioCuotasByDeporteModel
} from "../model/evento.model.js";

export const getEvento = async (req, res) => {
    try {
        const { deporte, cuota_local } = req.query;
        
        let result;
        if (deporte) {
            result = await getEventoByDeporteModel(deporte);
        } else if (cuota_local) {
            result = await getEventoByCuotaLocalModel(cuota_local);
        } else {
            result = await getEventoModel();
        }
        
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const postEvento = async (req, res) => {
    try {
        const info = req.body;
        const result = (info.length) ? 
            await postEventoManyModel(info) :
            await postEventoModel(info);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const updateCuotaEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { campo, valor } = req.body;
        const result = await updateEventoCuotaModel(id, campo, valor);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const deleteEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteEventoModel(id);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getPromedioCuotas = async (req, res) => {
    try {
        const result = await getPromedioCuotasByDeporteModel();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export default {
    getEvento, 
    postEvento,
    updateCuotaEvento,
    deleteEvento,
    getPromedioCuotas
}