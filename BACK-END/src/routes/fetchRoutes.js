import express  from "express";
import fetchController from "../controllers/fetchController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
 .get("/fetch", fetchController.ListarFetch)
 .post("/fetch", fetchController.CadastrarFetch)
 
export default router;