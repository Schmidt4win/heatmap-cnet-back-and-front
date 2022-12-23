import  express from "express";
import users from "./userRoutes.js";
import tomodat from "./tomodatRoutes.js"


const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({titulo: "curso de node"})
    })


   app.use(
     express.json(),
     users,
     tomodat
     )
}

export default routes;