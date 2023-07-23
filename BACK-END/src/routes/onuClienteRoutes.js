import express  from "express";
import OnuController from "../controllers/onuClientController.js";


const router = express.Router();

router
 
 .get("/onuget", OnuController.ListOnu) // lsita os dados dos equipamentos.
 
 
 export default router;