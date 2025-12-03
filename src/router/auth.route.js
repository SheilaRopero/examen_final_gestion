import { Router } from "express";
import { login, verifyOTP, checkAuth } from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/token.middleware.js";

const router = Router();

// Primer paso: Validar credenciales y enviar OTP
router.post("/login", login);

// Segundo paso: Validar OTP y entregar token
router.post("/verify-otp", verifyOTP);

// Ruta para verificar token
router.get("/check", verifyToken, checkAuth);

export default router;