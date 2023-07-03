import { fetchTomodat } from "../scripts/fetchApiTomodat.js";
import { getAllAcessPointsByCity } from "../scripts/fetchApiTomodat.js";
import { addClient } from "../scripts/fetchApiTomodat.js";
//import { deleteTomodat } from "../scripts/fetchApiTomodat.js";
import fetch from "node-fetch";
import tomodatcompleto16052023 from "../models/tomodatcompleto.js";

const reqConfig = {
  method: "DELETE",

  headers: {
    Authorization: "6f1abca83548d1d58a92e6562ed7e118358cc7ba",
    "Content-Type": "application/json",
    "Accept-encoding": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE",
  },
};

class TomodatController {
  static ListarClients = (req, res) => {
    fetchTomodat().then((data) => {
      res.json(data);
    });
  };

  static ListarCtos = (req, res) => {
    getAllAcessPointsByCity().then((data) => {
      res.json(data);
    });
  };

  static CadastrarClient = (req, res) => {
    addClient(req, res);
  };

  static DeleteClient = async (req, res) => {
    let id = req.params.id;
    try {
      const response = await fetch(
        `https://sp.tomodat.com.br/tomodat/api/clients/${id}`,
        reqConfig
      );

      console.log(`resposta do servidor do tomodat: ${response}`);
      if (response.ok) {
        res
          .status(201)
          .send({ ApiTomodatDeleteOk: `deletado com sucesso ${id}` });
      } else {
        res.status(201).send({ erro: "erro ao deletar cliente" });
      }
    } catch (err) {
      console.error("erro" + err);
    }
  };

  static ListarCabos = (req, res) => {
    tomodatcompleto16052023
      .find((err, tomodatcompleto16052023) => {
        res.status(200).json(tomodatcompleto16052023);
      })
      .sort({ _id: -1 });
  };

  static SalvarRota = (req, res) => {
    let novaRota = new tomodatcompleto16052023(req.body);
    novaRota.save((err) => {
      if (err) {
        res
          .status(500)
          .send({ message: `${err.message} - falha ao cadastrar rota.` });
      } else {
        res.status(200).send({ message: `tudo certo ao cadastrar rota.` });
      }
    });
  };
}

export default TomodatController;
