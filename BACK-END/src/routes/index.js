import  express from "express";
import users from "./userRoutes.js";
import tomodat from "./tomodatRoutes.js"
import token from "./tokenRoutes.js"


const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({message: "Estte é o servidor BACKEND da aplicação da Conectnet Telecomunicações"})
    })


   app.use(
     express.json(),
     users,
     tomodat,
     token
     )
}

export default routes;