import { Router } from "express";
import Index from "../controller/index.controller.js";

const route = Router();

route.use("/tournament", Index )

export default route;