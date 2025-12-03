import { validationResult } from "express-validator";

export const validate = (validations) => {
    return async (req, res, next) => {
        try {
            // Ejecutar todas las validaciones
            await Promise.all(
                validations.map(validation => validation.run(req))
            );

            // Obtener los resultados de la validación
            const errors = validationResult(req);

            // Si hay errores, responder con error
            if (!errors.isEmpty()) {
                return res.status(422).json({
                    success: false,
                    errors: errors.array()
                });
            }

            // Si no hay errores, continuar
            next();
            
        } catch (error) {
            console.log("Error en validación:", error);
            res.status(500).json({
                success: false,
                error: "Error interno en validación"
            });
        }
    };
};