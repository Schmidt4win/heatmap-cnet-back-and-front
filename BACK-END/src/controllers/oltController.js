import ramaisModel from "../models/ramaisOlt.js";
import { Client } from 'ssh2';
import dotenv from 'dotenv';
dotenv.config()
class oltController {

    static ListarRamais = (req, res) => {
        ramaisModel.find((err, ramal)=>{
        res.status(200).json(ramal)
        }).sort({_id: -1})
    }

       
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
  
      
      static listarOnu = (req, res) => {
        let host =  req.body.oltIp;
        const username = process.env.PARKS_USERNAME;
        const password = `#${process.env.PARKS_PASSWORD}`; 
        const conn = new Client();
      
        conn.on('ready', () => {
          console.log('Connected to the OLT');
          conn.shell((err, stream) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Error connecting to the OLT' });
              return;
            }
      
            let dataBuffer = '';
            let onus = [];
      
            stream.on('close', () => {
              console.log('Disconnected from the OLT');
              //console.log('JSON Output:', onus);
              res.json(onus);
              conn.end();
            }).on('data', (data) => {
              dataBuffer += data.toString();
              // Check for a complete line
              if (dataBuffer.includes('\n')) {
                const lines = dataBuffer.split('\n');
                dataBuffer = lines.pop(); // Store the incomplete line for future data
                for (const line of lines) {
                  //console.log('Output: ' + line);
                  // Parse and process the received line here
                  if (line.includes('|') && !line.includes('Interface')) {
                    const values = line.split('|').map(value => value.trim());
                    const [gpon, onuMac, onuModel] = values;
      
                    onus.push({
                      onuMac,
                      gpon,
                      onuModel
                    });
                  }
                }
              }
            });
      
            // Send the commands to the OLT
            stream.write('show gpon onu unconfigured\n');
            stream.write('exit\n');
          });
        }).on('error', (err) => {
          console.error(err);
          res.status(500).json({ error: 'Error connecting to the OLT' });
        }).connect({
          host: host,
          port: 22,
          username: username,
          password: password
        });
      }
      
      static liberarOnu = (req, res) => {
        let oltIp = req.body.oltIp;
        let oltPon = req.body.oltPon;
        let onuVlan = req.body.onuVlan;
        let gpon = oltPon;
        let onuSerial = req.body.onuSerial;
        let onuAlias = req.body.onuAlias;
        let flowProfile = `bridge_vlan_${onuVlan}`;
      
        const host = oltIp; // Replace with the IP address of your OLT
        const username = process.env.PARKS_USERNAME;
        const password = `#${process.env.PARKS_PASSWORD}`;
        const conn = new Client();
      
        conn.on('ready', () => {
          console.log('Connected to the OLT');
          conn.shell((err, stream) => {
            if (err) throw err;
            let dataBuffer = '';
            let jsonOutput = {};
      
            stream.on('close', () => {
              console.log('Disconnected from the OLT');
              console.log('JSON Output:', JSON.stringify(jsonOutput, null, 2));
              res.status(200).json(jsonOutput); // Send the JSON output as the response
              conn.end();
            }).on('data', (data) => {
              dataBuffer += data.toString();
              // Check for a complete line
              if (dataBuffer.includes('\n')) {
                const lines = dataBuffer.split('\n');
                dataBuffer = lines.pop(); // Store the incomplete line for future data
                for (const line of lines) {
                  console.log('Output: ' + line);
                  // Parse and process the received line here
                  if (line.includes(':')) {
                    const [key, value] = line.split(':');
                    const trimmedKey = key.trim();
                    const trimmedValue = value.trim();
      
                    if (trimmedKey === 'Status') {
                      jsonOutput[onuSerial] = { Status: trimmedValue };
                    } else if (trimmedKey === 'Power Level' || trimmedKey === 'RSSI') {
                      if (jsonOutput[onuSerial]) {
                        jsonOutput[onuSerial][trimmedKey] = trimmedValue;
                      }
                    }
                  }
                }
              }
            });
      
            // Send the commands to the OLT show gpon onu
            stream.write('configure terminal\n')
            stream.write(`interface ${gpon}\n`)
            stream.write(`onu ${onuSerial} alias ${onuAlias}\n`)
            stream.write(`onu ${onuSerial} flow ${flowProfile}\n`)
            stream.write(`onu ${onuSerial} vlan-translation-profile _${onuVlan} uni-port 1\n`)
            stream.write(`onu ${onuSerial} ethernet-profile auto-on uni-port 1\n`)
            stream.write('end\n');
            stream.write('copy r s\n');
            stream.write(`show gpon onu ${onuSerial} status\n`);
            stream.write('exit\n');
          });
        }).connect({
          host: host,
          port: 22,
          username: username,
          password: password
        });
      };
      
         
    
    }
    
    export default oltController;