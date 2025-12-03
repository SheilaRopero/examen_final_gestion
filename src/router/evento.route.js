import { Router } from "express";
import Evento from "../controller/evento.controller.js";

const router = Router();

router.get("/", Evento.getEvento);
router.post("/", Evento.postEvento);
router.put("/:id/cuota", Evento.updateCuotaEvento);
router.delete("/:id", Evento.deleteEvento);
router.get("/promedio-cuotas", Evento.getPromedioCuotas);

export default router;