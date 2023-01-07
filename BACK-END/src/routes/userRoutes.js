import express  from "express";
import UserController from "../controllers/usersController.js";


const router = express.Router();

router
 .get("/users", UserController.ListarUsers)
 .post("/users", UserController.CadastrarUser)
 .put("/users/:id", UserController.atualizarUser)
 .delete("/users/:id", UserController.excluirUser)
export default router;