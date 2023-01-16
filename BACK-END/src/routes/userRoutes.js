import express  from "express";
import UserController from "../controllers/usersController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router
 .get("/users",  UserController.ListarUsers)
 .post("/users", auth, UserController.RegisterUser)
 .put("/users/:id", auth, UserController.atualizarUser)
 .delete("/users/:id", auth, UserController.excluirUser)
 .get("/users/:id", auth, UserController.ListarUsersPorId)
 .post("/login", UserController.userLogin)
//   .post("/register", UserController.RegisterUser)
export default router;