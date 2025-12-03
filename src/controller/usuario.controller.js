import { 
    getUsuarioModel, 
    postUsuarioModel, 
    postUsuarioManyModel, 
    getUsuarioBySaldoModel,
    updateUsuarioSaldoModel,
    incrementarUsuarioSaldoModel,
    deleteUsuarioModel,
    getUsuariosConMayorGananciaModel
} from "../model/usuario.model.js";

export const getUsuario = async (req, res) => {
    try {
        const { saldo_minimo } = req.query;
        
        let result;
        if (saldo_minimo) {
            result = await getUsuarioBySaldoModel(saldo_minimo);
        } else {
            result = await getUsuarioModel();
        }
        
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const postUsuario = async (req, res) => {
    try {
        const info = req.body;
        const result = (info.length) ? 
            await postUsuarioManyModel(info) :
            await postUsuarioModel(info);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const updateSaldoUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { saldo } = req.body;
        const result = await updateUsuarioSaldoModel(id, saldo);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const incrementarSaldoUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { incremento } = req.body;
        const result = await incrementarUsuarioSaldoModel(id, incremento);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteUsuarioModel(id);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getUsuariosMayorGanancia = async (req, res) => {
    try {
        const result = await getUsuariosConMayorGananciaModel();
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export default {
    getUsuario, 
    postUsuario,
    updateSaldoUsuario,
    incrementarSaldoUsuario,
    deleteUsuario,
    getUsuariosMayorGanancia
}