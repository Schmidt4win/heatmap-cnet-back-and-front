import express  from "express";
import TomodatController from "../controllers/tomodatCrontoller.js";
import LogClientController from "../controllers/logsController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
 .get("/tomodat", TomodatController.ListarClients)
 .get("/ctos", TomodatController.ListarCtos)
 .post("/client", TomodatController.CadastrarClient)
 .post("/logctoclient",LogClientController.CadastrarLog)
 .get("/logctoclient", LogClientController.ListarLogCtoClient)
export default router;