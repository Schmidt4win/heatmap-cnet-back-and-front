import express  from "express";
import oltController from "../controllers/oltController.js";
import ReqMonitor from "../middleware/reqMonitor.js";
import OnuController from "../controllers/onuClientController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
  .get("/ramais", oltController.ListarRamais) // lista os ramais no banco.
  .post("/verificar-ramal", oltController.verificarRamais) // lista os ramais no banco.
  .post("/verificar-ramal-onu-configurar", oltController.VerificarOnuAConfigurarPon)
  .post("/listar-onu", oltController.listarOnu)
  .post("/verificar-onu", oltController.VerificarOnu)
  .post("/verificar-onu-completo", oltController.VerificarOnuSummary)
  .post("/verificar-pon", oltController.VerificarSinalPon)
  .post("/verificar-onu-name-pon", oltController.VerificarNomeOnuPon)
  .post("/verificar-onu-name-olt", oltController.VerificarNomeOnuOlt)
  .post("/liberar-onu", oltController.liberarOnu)
  .post("/editar-onu", OnuController.EditOnu, oltController.EditarOnu )
 
 
export default router;