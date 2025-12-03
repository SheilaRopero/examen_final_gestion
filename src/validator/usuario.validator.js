import { checkSchema } from "express-validator";

export const usuarioPost = checkSchema({
    nombre: {
        errorMessage: 'Nombre invalido',
        notEmpty: true,
        isLength: {
            options: { min: 3, max: 100 },
            errorMessage: 'El nombre debe tener mínimo 3 caracteres y máximo 100'
        }
    },
    correo: {
        isEmail: true,  
        errorMessage: "El correo debe ser válido (ejemplo: usuario@dominio.com)"
    },
    saldo: {
        errorMessage: 'El saldo no puede ser vacío',
        isNumeric: {
            options: { no_symbols: true },
            errorMessage: 'Deben ser números'
        },
        notEmpty: true,
        matches: { 
            options: /^[0-9]+$/, 
            errorMessage: 'Solo números permitidos' 
        },
        isLength: {
            options: { min: 1 },
            errorMessage: 'El saldo debe contener al menos un carácter'
        }
    },
    pais: {  
        errorMessage: 'El país es requerido',
        notEmpty: true,
        isLength: {
            options: { min: 2, max: 50 },
            errorMessage: 'El país debe tener entre 2 y 50 caracteres'
        }
    }
}, ["body"]);