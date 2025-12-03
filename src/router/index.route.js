import { Router } from "express";
import TournametRoute from "./tournament.route.js";
import ApuestaRoute from "./apuesta.route.js";
import UsuarioRoute from "./usuario.route.js";
import EventoRoute from "./evento.route.js";
import AuthRoute from "./auth.route.js";
import { verifyToken } from "../middleware/token.middleware.js";

const router = Router();

router.use(TournametRoute);

router.use('/apuesta', ApuestaRoute);

router.use('/usuario', UsuarioRoute);
router.use('/evento', EventoRoute);
router.use('/auth', AuthRoute);


router.get("/", (req, res) => {
    res.json({ 
        success: true,
        message: "API Casa de Apuestas funcionando!",
        endpoints: {
            usuarios: "/usuario",
            eventos: "/evento", 
            apuestas: "/apuesta",
            auth: "/auth"
        }
    });
});

export default router;