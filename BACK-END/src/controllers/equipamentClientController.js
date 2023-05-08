import equipament from "../models/equipamentClientModel.js";


class equipamentController  {
    static equipamenteSave = (req, res) => {
        // console.log("chegou aqui")
        let equipamento = new equipament(req.body)
        equipamento.save((err) =>{
            if(err) {
                res.status(500).send({message: `${err.message} - falha ao cadastrar o equipamento.`})
            } else{
                res.status(200).send({message: `tudo certo ao cadastrar o equipamento.`})
            }
        })
    };

    static FetchEquipament = (req, res) => {
        equipament.find((err, instalacoesForm)=>{
            res.status(200).send(instalacoesForm)
        }).sort({_id: -1})
    }

    static atualizarEquipament = (req, res) => {
        const id = req.params.id;
        let { name, ip, category } = req.body;
        let dados = {name, ip, category}
        
        equipament.findByIdAndUpdate (id, {$set: dados}, (err) => {
            if(!err) {
                res.status(200).send({message: `Alteração realizada com sucesso,`})
            } else {
                res.status(500).send({message: err.message})
      
       }})
       }

}


export default equipamentController;