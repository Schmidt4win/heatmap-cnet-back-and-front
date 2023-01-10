import express  from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

router
 .get("/auth", auth, (req, res) => {
    res.status(200).send(`message: ${req.body.name} autenticou com sucesso`);
  });
 

export default router;