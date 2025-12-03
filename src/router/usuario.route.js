import { Router } from "express";
import Usuario from "../controller/usuario.controller.js";
import { validate } from "../middleware/validator.middleware.js";
import { usuarioPost } from "../validator/usuario.validator.js";

const router = Router();

router.get("/", Usuario.getUsuario);
router.post("/", validate(usuarioPost), Usuario.postUsuario);
router.put("/:id/saldo", Usuario.updateSaldoUsuario);
router.put("/:id/incrementar-saldo", Usuario.incrementarSaldoUsuario);
router.delete("/:id", Usuario.deleteUsuario);
router.get("/mayor-ganancia", Usuario.getUsuariosMayorGanancia);

export default router;