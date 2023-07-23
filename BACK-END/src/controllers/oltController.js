import ramaisModel from "../models/ramaisOlt.js";
import { Client } from "ssh2";
import dotenv from "dotenv";
import OnuClient from "../models/onuClient.js";
dotenv.config();
class oltController {
  static ListarRamais = (req, res) => {
    ramaisModel
      .find((err, ramal) => {
        res.status(200).json(ramal);
      })
      .sort({ _id: -1 });
  };

  static verificarRamais = (req, res) => {
    let searchString = req.body.Ramal;
    console.log(searchString);
    let regex = new RegExp(searchString, "i"); // "i" for case-insensitive search

    ramaisModel.find({ ID: { $regex: regex } }, (err, ramal) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: `Back-end err: ${err}` });
      } else {
        if (ramal.length === 0) {
          res.status(200).json({ message: "No Ramal found" });
        } else {
          res.status(200).json(ramal);
        }
      }
    });
  };

  static VerificarOnu = (req, res) => {
    let host = req.body.oltIp;
    let onuAlias = req.body.onuAlias;
    const username = process.env.PARKS_USERNAME;
    const password = `#${process.env.PARKS_PASSWORD}`;
    const conn = new Client();

    conn
      .on("ready", () => {
        console.log("Connected to the OLT");
        conn.shell((err, stream) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Error connecting to the OLT" });
            return;
          }

          let dataBuffer = "";
          let onus = [];
          let jsonOutput = {};

          stream
            .on("close", () => {
              console.log("Disconnected from the OLT");
              res.json(jsonOutput); // Send jsonOutput as the response
              console.log(jsonOutput);
              conn.end();
            })
            .on("data", (data) => {
              dataBuffer += data.toString();
              if (dataBuffer.includes("\n")) {
                const lines = dataBuffer.split("\n");
                dataBuffer = lines.pop();
                for (const line of lines) {
                  if (line.startsWith("%")) {
                    // Skip lines starting with %
                    continue;
                  }
                  console.log("Output: " + line);

                  if (line.includes(":")) {
                    const [key, value] = line.split(":");
                    const trimmedKey = key.trim();
                    const trimmedValue = value.trim();

                    if (trimmedKey === "Status") {
                      jsonOutput[onuAlias] = { Status: trimmedValue };
                    } else if (
                      trimmedKey === "Power Level" ||
                      trimmedKey === "RSSI"
                    ) {
                      if (jsonOutput[onuAlias]) {
                        jsonOutput[onuAlias][trimmedKey] = trimmedValue;
                      }
                    }
                  }
                }
              }
            });

          stream.write(`show gpon onu ${onuAlias} status\n`);
          stream.write("exit\n");
        });
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).json({ error: "Error connecting to the OLT" });
      })
      .connect({
        host: host,
        port: 22,
        username: username,
        password: password,
      });
  };

  static VerificarSinalPon = (req, res) => {
    let host = req.body.oltIp;
    let gpon = req.body.oltPon;
    const username = process.env.PARKS_USERNAME;
    const password = `#${process.env.PARKS_PASSWORD}`;
    const conn = new Client();

    conn
      .on("ready", () => {
        console.log("Connected to the OLT");
        conn.shell((err, stream) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Error connecting to the OLT" });
            return;
          }

          let dataBuffer = "";
          let jsonOutput = {}; // Declare jsonOutput here to store ONU data
          let onuAlias = null; // Initialize onuAlias outside the data event

          stream
            .on("close", () => {
              console.log("Disconnected from the OLT");
              res.json(jsonOutput); // Send the modified JSON as the response
              console.log(jsonOutput);
              conn.end();
            })
            .on("data", (data) => {
              dataBuffer += data.toString();
              if (dataBuffer.includes("\n")) {
                const lines = dataBuffer.split("\n");
                dataBuffer = lines.pop();
                for (const line of lines) {
                  console.log("Output: " + line);

                  const onuAliasMatch = line.match(/^\s*[\d-]*([\w-]+)(?::|$)/); // Modified regex to handle alias without colon
                  if (onuAliasMatch) {
                    onuAlias = onuAliasMatch[1];
                    jsonOutput[onuAlias] = { mac: onuAlias }; // Add the 'mac' field to the object for the current ONU
                  } else if (onuAlias && line.includes(":")) {
                    const [key, value] = line.split(":");
                    const trimmedKey = key.trim();
                    const trimmedValue = value.trim();

                    if (trimmedKey === "Status") {
                      jsonOutput[onuAlias][trimmedKey] = trimmedValue;
                    } else if (
                      trimmedKey === "Power Level" ||
                      trimmedKey === "RSSI"
                    ) {
                      jsonOutput[onuAlias][trimmedKey] = trimmedValue;
                    }
                  }
                }
              }
            });
          stream.write("terminal length 0\n");
          stream.write(`sh interface ${gpon} onu status\n`);
          stream.write("exit\n");
        });
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).json({ error: "Error connecting to the OLT" });
      })
      .connect({
        host: host,
        port: 22,
        username: username,
        password: password,
      });
};
  static listarOnu = (req, res) => {
    let host = req.body.oltIp;
    const username = process.env.PARKS_USERNAME;
    const password = `#${process.env.PARKS_PASSWORD}`;
    const conn = new Client();

    conn
      .on("ready", () => {
        console.log("Connected to the OLT");
        conn.shell((err, stream) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Error connecting to the OLT" });
            return;
          }

          let dataBuffer = "";
          let onus = [];

          stream
            .on("close", () => {
              console.log("Disconnected from the OLT");
              console.log(onus);
              res.json(onus);
              conn.end();
            })
            .on("data", (data) => {
              
              dataBuffer += data.toString();
              if (dataBuffer.includes("\n")) {
                const lines = dataBuffer.split("\n");
                dataBuffer = lines.pop();
                for (const line of lines) {
                  if (line.includes("|") && !line.includes("Interface")) {
                    const values = line.split("|").map((value) => value.trim());
                    const [gpon, onuMac, onuModel] = values;

                    onus.push({
                      onuMac,
                      gpon,
                      onuModel,
                    });
                  }
                }
              }
              
            });
          stream.write("show gpon onu unconfigured\n");
          stream.write("exit\n");
        });
      })
      .on("error", (err) => {
        console.error(err);
        res.status(500).json({ error: "Error connecting to the OLT" });
      })
      .connect({
        host: host,
        port: 22,
        username: username,
        password: password,
      });
  };

  static liberarOnu = (req, res) => {
    let oltIp = req.body.oltIp;
    let oltPon = req.body.oltPon;
    let onuVlan = req.body.onuVlan;
    let gpon = oltPon;
    let onuSerial = req.body.onuSerial;
    let onuAlias = req.body.onuAlias;
    let flowProfile = `bridge_vlan_${onuVlan}`;
    console.log(req.body);
    let date_time = new Date().toLocaleString("PT-br");
    let user = req.body.user;
    let clienteDb = {
      date_time,
      oltIp,
      oltPon,
      onuVlan,
      onuSerial,
      onuAlias,
      user,
    };
    let onuRegister = new OnuClient(clienteDb);
    onuRegister.save(console.log(`Onu salva no banco: ${clienteDb}`));

    const host = oltIp;
    const username = process.env.PARKS_USERNAME;
    const password = `#${process.env.PARKS_PASSWORD}`;
    const conn = new Client();

    conn
      .on("ready", () => {
        console.log("Connected to the OLT");
        conn.shell((err, stream) => {
          if (err) throw err;
          let dataBuffer = "";
          let jsonOutput = {};

          stream
            .on("close", () => {
              console.log("Disconnected from the OLT");
              console.log("JSON Output:", JSON.stringify(jsonOutput, null, 2));
              res.status(200).json(jsonOutput);
              conn.end();
            })
            .on("data", (data) => {
              dataBuffer += data.toString();
              if (dataBuffer.includes("\n")) {
                const lines = dataBuffer.split("\n");
                dataBuffer = lines.pop();
                for (const line of lines) {
                  console.log("Output: " + line);

                  if (line.includes(":")) {
                    const [key, value] = line.split(":");
                    const trimmedKey = key.trim();
                    const trimmedValue = value.trim();

                    if (trimmedKey === "Status") {
                      jsonOutput[onuSerial] = { Status: trimmedValue };
                    } else if (
                      trimmedKey === "Power Level" ||
                      trimmedKey === "RSSI"
                    ) {
                      if (jsonOutput[onuSerial]) {
                        jsonOutput[onuSerial][trimmedKey] = trimmedValue;
                      }
                    }
                  }
                }
              }
            });

          stream.write("configure terminal\n");
          stream.write(`interface ${gpon}\n`);
          stream.write(`onu add serial-number ${onuSerial}\n`);
          stream.write(`onu ${onuSerial} alias ${onuAlias}\n`);
          stream.write(`onu ${onuSerial} flow ${flowProfile}\n`);
          stream.write(
            `onu ${onuSerial} vlan-translation-profile _${onuVlan} uni-port 1\n`
          );
          stream.write(
            `onu ${onuSerial} ethernet-profile auto-on uni-port 1\n`
          );
          stream.write("end\n");
          stream.write("copy r s\n");
          stream.write(`show gpon onu ${onuSerial} status\n`);
          stream.write("exit\n");
        });
      })
      .connect({
        host: host,
        port: 22,
        username: username,
        password: password,
      });
  };
}

export default oltController;
