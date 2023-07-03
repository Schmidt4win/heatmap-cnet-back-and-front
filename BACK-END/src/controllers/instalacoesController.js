import instalacoesForm from "../models/instalacoesModel.js";

class InstalacoesController {
  static SaveInstalacao = (req, res) => {
    console.log("chegou aqui");
    let instalacao = new instalacoesForm(req.body);
    instalacao.save((err) => {
      if (err) {
        res
          .status(500)
          .send({ message: `${err.message} - falha ao cadastrar cliente.` });
      } else {
        res.status(200).send({ message: `tudo certo ao cadastrar cliente.` });
      }
    });
  };
  static FetchInstalacao = (req, res) => {
    instalacoesForm
      .find((err, instalacoesForm) => {
        res.status(200).send(instalacoesForm);
      })
      .sort({ _id: -1 });
  };
}

export default InstalacoesController;
