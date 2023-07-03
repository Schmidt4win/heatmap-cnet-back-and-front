import { Client } from "ssh2";

class BackupController {
  static mkBackup = (req, res) => {
    try {
      console.log(req.body);
      const conn = new Client();
      let clienteName = req.body.clienteName;
      let clienteIp = req.body.clienteIp;
      let clienteUsername = req.body.clienteUsername;
      let clientePassword = req.body.clientePassword;
      let clientePort = req.body.clientePort;

      conn.on("ready", () => {
        console.log("Client :: ready");

        conn.exec(`export file=${clienteName}`, (err, stream) => {
          if (err) throw err;
          stream
            .on("close", (code, signal) => {
              console.log(
                `Stream :: close :: code: ${code}, signal: ${signal}`
              );

              conn.exec(
                `/tool fetch url=ftp://mkteste1:mkteste@177.73.24.22/${clienteName}.rsc upload=yes mode=ftp`,
                (err, stream) => {
                  if (err) throw err;
                  stream
                    .on("close", (code, signal) => {
                      console.log(
                        `Stream :: close :: code: ${code}, signal: ${signal}`
                      );
                      conn.end();
                      res.status(201).send({ message: "Backup realizado" });
                    })
                    .on("data", (data) => {
                      console.log(`STDOUT: ${data}`);
                    })
                    .stderr.on("data", (data) => {
                      console.log(`STDERR: ${data}`);
                    });
                }
              );
            })
            .on("data", (data) => {
              console.log(`STDOUT: ${data}`);
            })
            .stderr.on("data", (data) => {
              console.log(`STDERR: ${data}`);
            });
        });
      });

      conn.on("error", (err) => {
        console.error(err);
        conn.end();
        res.status(500).send({ message: "Erro" });
      });

      conn.connect({
        host: clienteIp,
        port: clientePort,
        username: clienteUsername,
        password: clientePassword,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Erro" });
    }
  };

  static ubntBackup = (req, res) => {
    try {
      console.log(req.body);
      const conn = new Client();
      let clienteName = req.body.clienteName;
      let clienteIp = req.body.clienteIp;
      let clienteUsername = req.body.clienteUsername;
      let clientePassword = req.body.clientePassword;

      conn.on("ready", () => {
        console.log("Client :: ready");

        conn.exec("mca-ctrl -t dump-cfg > /tmp/system.cfg", (err, stream) => {
          if (err) throw err;
          stream
            .on("close", (code, signal) => {
              console.log(
                `Stream :: close :: code: ${code}, signal: ${signal}`
              );

              conn.exec(
                `/bin/busybox wget -O /tmp/system.cfg ftp://177.73.24.22/mkteste1/mkteste/system.cfg`,
                (err, stream) => {
                  if (err) throw err;
                  stream
                    .on("close", (code, signal) => {
                      console.log(
                        `Stream :: close :: code: ${code}, signal: ${signal}`
                      );
                      conn.end();
                      res.status(201).send({ message: "Backup realizado" });
                    })
                    .on("data", (data) => {
                      console.log(`STDOUT: ${data}`);
                    })
                    .stderr.on("data", (data) => {
                      console.log(`STDERR: ${data}`);
                    });
                }
              );
            })
            .on("data", (data) => {
              console.log(`STDOUT: ${data}`);
            })
            .stderr.on("data", (data) => {
              console.log(`STDERR: ${data}`);
            });
        });
      });

      conn.on("error", (err) => {
        console.error(err);
        conn.end();
        res.status(500).send({ message: "Erro" });
      });

      conn.connect({
        host: clienteIp,
        port: 22,
        username: clienteUsername,
        password: clientePassword,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Erro" });
    }
  };

  static hwBackup = (req, res) => {
    try {
      console.log(req.body);
      const conn = new Client();
      let clienteName = req.body.clienteName;
      let clienteIp = req.body.clienteIp;
      let clienteUsername = req.body.clienteUsername;
      let clientePassword = req.body.clientePassword;

      conn.on("ready", () => {
        console.log("Client :: ready");

        conn.exec(`system-view && save ${clienteName}.cfg`, (err, stream) => {
          if (err) throw err;
          stream
            .on("close", (code, signal) => {
              console.log(
                `Stream :: close :: code: ${code}, signal: ${signal}`
              );

              conn.exec(
                `ftp ${ftpServerAddress} && put ${clienteName}.cfg`,
                (err, stream) => {
                  if (err) throw err;
                  stream
                    .on("close", (code, signal) => {
                      console.log(
                        `Stream :: close :: code: ${code}, signal: ${signal}`
                      );
                      conn.end();
                      res.status(201).send({ message: "Backup realizado" });
                    })
                    .on("data", (data) => {
                      console.log(`STDOUT: ${data}`);
                    })
                    .stderr.on("data", (data) => {
                      console.log(`STDERR: ${data}`);
                    });
                }
              );
            })
            .on("data", (data) => {
              console.log(`STDOUT: ${data}`);
            })
            .stderr.on("data", (data) => {
              console.log(`STDERR: ${data}`);
            });
        });
      });

      conn.on("error", (err) => {
        console.error(err);
        conn.end();
        res.status(500).send({ message: "Erro" });
      });

      conn.connect({
        host: clienteIp,
        port: 22,
        username: clienteUsername,
        password: clientePassword,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Erro" });
    }
  };
}

export default BackupController;
