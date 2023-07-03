import PppoeData from "../models/pppoeModel.js";
import { Client } from "ssh2";
import PppoeOnlineData from "../models/pppoeDataModel.js";
import dotenv from "dotenv";
dotenv.config();

class PppoeDataController {
  static ListarPppoe = (req, res) => {
    PppoeData.find((err, user) => {
      res.status(200).json(user);
    }).sort({ _id: -1 });
  };

  static CadastroPppoe = (req, res, next) => {
    let { name, lat, lng, cto_id, cto_name, pppoe } = req.body;
    let cadastro = { name, lat, lng, cto_id, cto_name, pppoe };
    let pppoeCadastro = new PppoeData(cadastro);
    pppoeCadastro.save((err) => {
      if (err) {
        res
          .status(500)
          .send({ message: `${err.message} - falha ao cadastrar pppoe.` });
      } else {
        return next();
      }
    });
  };

  static pppoeOnline = (req, res) => {
    let pppoe = req.body.pppoe;

    const sshClient = new Client();

    sshClient.connect({
      host: process.env.HUAWEY_HOST,
      username: process.env.HUAWEY_USERNAME,
      password: `#${process.env.HUAWEY_PASSWORD}`,
    });

    sshClient.on("ready", () => {
      sshClient.exec(`display access-user username ${pppoe}`, (err, stream) => {
        if (err) throw err;
        let output = "";
        stream.on("data", (data) => {
          output += data.toString();
        });
        stream.on("close", () => {
          if (output.includes("PPPoE")) {
            res.status(201).send({ message: "PPPoE is online." });
          } else {
            res.status(500).send({ message: "PPPoE is offline or not exist." });
          }
          sshClient.end();
        });
        stream.stderr.on("data", (data) => {
          console.error(data.toString());
        });
      });
    });
    sshClient.on("error", (err) => {
      console.error(err);
    });

    sshClient.on("close", () => {
      console.log("SSH connection closed.");
    });
  };

  static findAllPppoe = async (req, res) => {
    try {
      const docs = await PppoeData.find({}, { _id: 0, pppoe: 1 }).exec();
      const pppoeFields = docs.map((doc) => doc.pppoe);
      console.log(pppoeFields);
    } catch (error) {
      console.error(error);
    }
  };

  static findAllPppoeOnline = (req, res) => {
    function executeSSHCommands() {
      return new Promise((resolve, reject) => {
        const config = {
          host: process.env.HUAWEY_HOST,
          username: process.env.HUAWEY_USERNAME,
          password: `#${process.env.HUAWEY_PASSWORD}`,
        };

        const commands = [
          "screen-length 0 temporary",
          "display access-user brief",
          "q",
        ];
        let terminalData = "";

        const conn = new Client();
        conn
          .on("ready", () => {
            console.log("SSH connection established");
            conn.shell((err, stream) => {
              if (err) reject(err);
              stream
                .on("close", () => {
                  console.log("Stream closed");
                  conn.end();
                  resolve(terminalData);
                })
                .on("data", (data) => {
                  terminalData += data;
                });
              for (const cmd of commands) {
                stream.write(`${cmd}\n`);
              }
              stream.end();
            });
          })
          .on("error", (err) => {
            console.error("SSH connection error:", err);
            resolve(terminalData);
          })
          .connect(config);
      });
    }

    (async () => {
      try {
        const terminalData = await executeSSHCommands();
        const lines = terminalData.split("\n").map((line) => line.trim());
        const jsonData = {};

        let currentKey;
        let currentData = {};

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes("fibra")) {
            currentKey = lines[i].split(" ")[0];
            currentData = {
              pppoe: lines[i].split("      ")[1].trim(),
              interface: lines[i + 1],
              ipv4: lines[i + 2],
              ipv6: lines[i + 3],
              mac: lines[i + 4],
              vlan: lines[i + 5],
            };
            jsonData[currentKey] = currentData;
          }
        }
        res.status(201).send(jsonData);
      } catch (error) {
        res.status(500).send("An error occurred:", error);
      }
    })();
  };

  static SavePppoeOnline = (req, res) => {
    console.log("os dados chegaram aqui");
    let pppoeonlinenow = new PppoeOnlineData(req.body);
    pppoeonlinenow.save((err) => {
      if (err) {
        res
          .status(500)
          .send({ message: `${err.message} - falha ao cadastrar cliente.` });
      } else {
        res.status(200).send({ message: `tudo certo ao cadastrar cliente.` });
      }
    });
  };

  static atualizarPppoe = (req, res) => {
    let id = req.params.id;
    let dados = req.body;
    PppoeData.findByIdAndUpdate(id, { $set: dados }, (err) => {
      if (!err) {
        let now = new Date().toLocaleString("PT-br");
        console.log(dados, now);
        res.status(200).send(dados);
      } else {
        res.status(500).send({ message: err.message });
      }
    });
  };

  static deletarPppoe = (req, res) => {
    let id = req.params.id;
    console.log(id);
    let dados = req.body;
    PppoeData.findByIdAndDelete(id, { $set: dados }, (err) => {
      if (!err) {
        console.log(dados);
        res.status(200).send({ message: "PPPoE deletado com sucesso da CTO" });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
  };
}
export default PppoeDataController;
