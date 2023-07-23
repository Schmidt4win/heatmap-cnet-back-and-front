import express  from "express";
import oltController from "../controllers/oltController.js";
import ReqMonitor from "../middleware/reqMonitor.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
  .get("/ramais", oltController.ListarRamais) // lista os ramais no banco.
  .post("/verificar-ramal", oltController.verificarRamais) // lista os ramais no banco.
  .post("/listar-onu", oltController.listarOnu)
  .post("/verificar-onu", oltController.VerificarOnu)
  .post("/verificar-pon", oltController.VerificarSinalPon)
  .post("/liberar-onu", oltController.liberarOnu)
 
 
export default router;