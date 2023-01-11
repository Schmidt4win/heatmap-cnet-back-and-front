import express  from "express";
import UserController from "../controllers/usersController.js";


const router = express.Router();

router
 .get("/users", UserController.ListarUsers)
 .post("/users", UserController.RegisterUser)
 .put("/users/:id", UserController.atualizarUser)
 .delete("/users/:id", UserController.excluirUser)
 .get("/users/:id", UserController.ListarUsersPorId)
 .post("/login", UserController.userLogin)
  .post("/register", UserController.RegisterUser)
export default router;