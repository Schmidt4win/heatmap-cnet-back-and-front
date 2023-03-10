import ctoClientLog from "../models/ctoClientLogModel.js"




class CtoClientLogController {

    static CadastrarCtoClientLogN = (req, res, next) => {
        let CtoClientLogs = new ctoClientLog(req.body);
            CtoClientLogs.save((err) =>{
            if(err) {
                res.status(500).send({message: `${err.message} - falha ao cadastrar cliente a CTO.`})
            } else {
                // res.status(201).send({DbLogCtoClient: `${logCtoClients.date_time}: Cliente ${logCtoClients.name} cadastrado com sucesso na cto ${logCtoClients.cto_name} pelo usuario: ${logCtoClients.user}.`})
                return next();
            }
        })
    };

//     static CadastrarCtoClient = (req, res, next) => {
//         let ctoClients = new ctoClient(req.body);
//             ctoClients.save((err) =>{
//             if(err) {
//                 res.status(500).send({message: `${err.message} - falha ao cadastrar cliente a CTO.`})
//             } else{
//                  res.status(201).send({DbCtoClient: `${ctoClients.date_time}: Cliente ${ctoClients.name} cadastrado com sucesso na cto ${ctoClients.cto_name} pelo usuario: ${ctoClients.user}.`})
//             }
//         })
//     };

    static ListarCtoClient = (req, res) => {
    ctoClientLog.find((err, ctoClient)=>{
    res.status(200).send(ctoClient)
}).sort({_id: -1}) //sort id -1 retorna as adições mais novas no banco
};


static deleteCtoClientLog = (req, res) => {
    let id = req.params.id
    ctoClientLog.findByIdAndDelete(id, (err) => {
        if(err) {
            res.status(500).send({message: `${err.message} - falha ao deletar log.`})
        } else {
            res.status(201).send({message: `log deletado com sucesso`})
        }
    })
}
   
// static ListarCtoClientById = (req, res) => {
//     let id = req.body.cto_id
//     let name = req.body.name
//     ctoClient.findOne({"cto_id": id, "name": name},
//     (err, ctoClient)=>{
//     if(ctoClient) {
//      res.status(200).send({link:`https://www.google.com/maps/search/?api=1&query=${ctoClient.lat},${ctoClient.lng}`, lat: ctoClient.lat, lng: ctoClient.lng})} 
//     else {
//      res.status(400).send(false)   
//     }
// }).sort({_id: -1}) //sort id -1 retorna as adições mais novas no banco
// };
// static UpdateCtoClientById = (req, res) => {
//     let id = req.body.cto_id
//     let name = req.body.name
//     let dados = req.body
//     ctoClient.findOneAndUpdate({"cto_id": id, "name": name }, {$set: dados},
//     (err, ctoClient)=>{
//     if(ctoClient) {
//      res.status(200).send({message: "Atualizada a localização do usuario com sucesso."})} 
//     else {
//      res.status(404).send(false)   
//     }
// }).sort({_id: -1}) //sort id -1 retorna as adições mais novas no banco
// };

  
};




export default CtoClientLogController;