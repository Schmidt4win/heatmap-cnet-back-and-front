import express  from "express";
import OnuController from "../controllers/onuClientController.js";


const router = express.Router();

router
 
 .get("/onuget", OnuController.ListOnu) // lsita os dados dos equipamentos.
 .get("/allonuget", OnuController.ListAllOnu)
 .delete("/ramaldelete/:id", OnuController.DeleteOnu)
 .get("/onuedit", OnuController.EditOnu)
 
 
 export default router;