import user from "../models/users.js";


class UserController {

static ListarUsers = (req, res) => {
    user.find((err, user)=>{
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

    user.findByIdAndUpdate (id, {$set: req.body}, (err) => {
        if(!err) {
            res.status(200).send({message: `Senha alterada com sucesso!`})
        } else {
            res.status(500).send({message: err.message})
        }
    })
    
}

}

export default UserController

