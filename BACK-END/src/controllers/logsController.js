import logCtoClient from "../models/logsCtoClient.js";

class LogClientController {
  static CadastrarLog = (req, res, next) => {
    let logCtoClients = new logCtoClient(req.body);
    logCtoClients.save((err) => {
      if (err) {
        res
          .status(500)
          .send({ message: `${err.message} - falha ao cadastrar user.` });
      } else {
        return next();
      }
    });
  };

  static ListarLogCtoClient = (req, res) => {
    logCtoClient
      .find((err, logCtoClient) => {
        res.status(200).send(logCtoClient);
      })
      .sort({ _id: -1 });
  };

  static deleteCtoClientLog = (req, res) => {
    let id = req.params.id;
    logCtoClient.findByIdAndDelete(id, (err) => {
      if (err) {
        res
          .status(500)
          .send({ message: `${err.message} - falha ao deletar log.` });
      } else {
        res.status(201).send({ message: `log deletado com sucesso` });
      }
    });
  };
}

export default LogClientController;
