import { Router } from "express";
import Apuesta from "../controller/apuesta.controller.js";

const router = Router();

router.get("/", Apuesta.getApuesta);
router.post("/", Apuesta.postApuesta);
router.put("/:id/estado", Apuesta.updateEstadoApuesta);
router.get("/total-usuario", Apuesta.getTotalPorUsuario);

export default router;