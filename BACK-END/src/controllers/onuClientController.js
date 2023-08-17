import OnuClient from "../models/onuClient.js";
import AllClientsRamalData from "../models/allOnuClients.js";

class OnuController {
 

static ListOnu = (req, res) => {
    OnuClient.find((err, user) => {
        res.status(200).json(user);
      })
      .sort({ _id: -1 });
}

static ListAllOnu = (req, res) => {
    AllClientsRamalData.find((err, user) => {
        res.status(200).json(user);
      })
      .sort({ _id: -1 });
}

static DeleteOnu = (req, res) => {
    let id = req.params.id;
    AllClientsRamalData.findByIdAndDelete(id, (err) => {
      if (err) {
        res
          .status(500)
          .send({ message: `${err.message} - falha ao deletar dados.` });
      } else {
        res.status(201).send({ message: `Dados deletados com sucesso.` });
      }
    });
}

static EditOnu = (req, res, next) => {
    let oldAlias = req.body.Alias;
    let newAlias = req.body.onuAlias

    OnuClient.findOneAndUpdate(
        { onuAlias: oldAlias }, // Filtro pelo antigo alias
        { $set: { onuAlias: newAlias } }, // Atualiza o campo onuAlias para o novo valor
        { new: true } // Opção para retornar o documento atualizado
    )
    .sort({ _id: -1 })
    .exec((err, cliente) => {
        if (err) {
            // Em caso de erro, retornar uma resposta com o status de erro e a mensagem de erro
            return res.status(500).json({ error: "Ocorreu um erro ao atualizar a ONU." });
        }

        // Se tudo ocorrer bem, retorna o cliente atualizado
    console.log("editou o cliente")
       return next();
    });
}

}

export default OnuController;
