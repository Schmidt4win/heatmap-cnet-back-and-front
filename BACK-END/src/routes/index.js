import  express from "express";
import users from "./userRoutes.js";
import tomodat from "./tomodatRoutes.js";
import token from "./tokenRoutes.js";
import fetch from "./fetchRoutes.js";
import cto from "./ctoClientRoutes.js"
import tracking from "./trackingRoutes.js";
import login from "./loginRoutes.js";
import instalacoes from "./instalacoesRoutes.js"
import vlan from "./vlanRoutes.js";
import pppoe from "./pppoeRoutes.js";
import equipament from "./equipamentRoutes.js"
import backup from "./backupRoutes.js"
import olt from "./oltRoutes.js"
import onu from "./onuClienteRoutes.js"

const routes = (app) => {
    app.route('/').get((req, res) => {
        res.status(200).send({message: "Estte é o servidor BACKEND da aplicação da Conectnet Telecomunicações"})
    })


   app.use(
     express.json(),
     users,
     tomodat,
     token,
     fetch,
     cto,
     tracking,
     login,
     instalacoes,
     vlan,
     pppoe,
     equipament,
     backup,
     olt,
     onu
     )
}

export default routes;