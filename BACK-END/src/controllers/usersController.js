import user from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// require("dotenv").config();
// import { config } from "dotenv"
import * as dotenv from 'dotenv';
dotenv.config()

class UserController {

static ListarUsers = (req, res) => {
    user.find((err, user)=>{
    res.status(200).json(user)
})
}

static ListarUsersPorId = (req, res) => {
  const id = req.params.id;
  user.findById(id, (err, user)=>{
  res.status(200).json(user)
})
}

static CadastrarUser = (req, res) => {
    let users = new user(req.body);
    users.save((err) =>{
        if(err) {
            res.status(500).send({message: `${err.message} - falha ao cadastrar user.`})
        } else{
            res.status(201).send(users.toJSON())
        }
    })
} 

static atualizarUser = (req, res) => {
  const id = req.params.id;
  let { name, password, category } = req.body;

  let encryptedPassword = bcrypt.hash(password, 10);

  let dados = {name, encryptedPassword, category};
  
  user.findByIdAndUpdate (id, {$set: dados}, (err) => {
      if(!err) {
          res.status(200).send({message: `Alteração realizada com sucesso,`})
      } else {
          res.status(500).send({message: err.message})

 }})
 }

static RegisterUser = async (req, res) => {
    try {
      // Get user input
      let { name, password, category } = req.body;
  
      // Validate user input
      if (!(name && password )) {
        res.status(400).send("All input is required");
      } 
  
      // check if user already exist
      // Validate if user exist in our database
       let oldUser = await user.find({name});
  
       if (oldUser === name) {
        return res.status(409).send("User Already Exist. Please Login")
      } else {
  
      //Encrypt user password
     let encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      let usuario = await user.create({
        name,
        category,
        password: encryptedPassword,
      });
      
      // Create token
      let token = jwt.sign(
        { user_id: usuario._id, name },
        process.env.TOKEN_KEY,
        {
          expiresIn: "180h",
        }
      );
      // save user token
      
        usuario.save( usuario.token = token);
  
      // return new user
      res.status(201).send({message: `${usuario.name} - cadastrado.`});
    }} catch (err) {
      console.log(err);
    }
  };

  static userLogin = async (req, res) => {
    try {
      // Get user input
      let { name, password } = req.body;
  
      // Validate user input
      if (!(name && password)) {
        res.status(400).send("All input is required");
      } 
      // Validate if user exist in our database
      let usuario = await user.findOne({ name });
  
      if (usuario && (await bcrypt.compare(password, usuario.password))) {
        // Create token
        let token = jwt.sign(
          { user_id: usuario._id, name },
          process.env.TOKEN_KEY,
          {
            expiresIn: "24h",
          }
        );
  
        // save user token
        usuario.save( usuario.token = token);
  
        // user
        let retorno = {
          name: usuario.name,
          category: usuario.category,
          token: usuario.token
          }
        res.status(201).send(retorno);
      } else {
        res.status(404).send({message: `Usuario ou senha invalidos.`})};
    } catch (err) {
      console.log(err);
    }
  };

  static excluirUser = (req, res) => {
    const id = req.params.id;
    user.findByIdAndDelete(id, (err) =>{
        if(!err){
            res.status(200).send({message: `Usuario id: ${req.body.id} removido com sucesso`})
        } else {
            res.status(500).send({message: err.message})
        }
    })
 }

}

export default UserController
